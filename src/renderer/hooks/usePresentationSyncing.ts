import { useState, useEffect, useCallback } from 'react';
import { database } from '../models/firebase';
import { syncLocalPresentation } from '../models/PresentationSyncer';
import { MainProcessMethodIdentifiers } from '../shared/types/identifiers';
import {
	SinglePresentation,
	StoredPresentation,
} from '../shared/types/presentation';
import {
	LocalSyncPresentationItem,
	RemotelyAvailableMedia,
	SyncPaperEntry,
} from '../types/presentaitonSycncing';
import { RemoteUser } from '../types/remote';

const ipcRenderer = window.electron;

const usePresentationSyncing = (
	connected: boolean,
	remoteUser?: RemoteUser
) => {
	const [syncPaper, setSyncPaper] = useState<Map<string, SyncPaperEntry>>(
		new Map()
	);
	const [localSyncingQueue, setLocalSyncingQueue] = useState<
		LocalSyncPresentationItem[]
	>([]);
	const [presProgess, setProgress] = useState<Map<number, number>>(new Map());
	const [downloadingPresentations, setDownloadingPresentations] = useState<
		string[]
	>([]);

	const getRemotePresentationsFromSyncPaper = useCallback(
		(callback?: () => void) => {
			if (remoteUser === undefined) return;
			setSyncPaper(new Map([]));

			if (connected)
				database.getSyncPaper(remoteUser.uid).then((snapshot) => {
					if (snapshot.exists()) {
						const paper: any = snapshot.val();
						const paperMap = new Map();
						for (const key in paper) {
							paperMap.set(key, paper[key]);
						}
						setSyncPaper(paperMap);
					}
					if (callback) callback();
				});
		},
		[remoteUser, connected]
	);

	const clear = useCallback(() => {
		setSyncPaper(new Map());
		setLocalSyncingQueue([]);
		setProgress(new Map());
	}, []);

	const addToLocalSyncingQueue = (
		presentation: SinglePresentation,
		presentationId: number,
		remoteMedia: RemotelyAvailableMedia[],
		callback: (remoteId: string) => void
	) => {
		if (
			localSyncingQueue.find(
				(pres) => pres.presentation.name === presentation.name
			) !== undefined ||
			remoteUser === undefined
		)
			return;

		setLocalSyncingQueue((curr) => [
			...curr,
			{
				presentation: presentation,
				presentationId: presentationId,
				progress: 0,
			},
		]);

		syncLocalPresentation(
			remoteUser.uid,
			presentation,
			remoteMedia,
			(progress) => {
				setProgress((curr) => new Map([...curr, [presentationId, progress]]));
			},
			(tasks, audioTasks) => {
				const presToSave = JSON.parse(
					JSON.stringify(presentation)
				) as SinglePresentation;
				tasks.forEach((task) => {
					presToSave.slides[task.slide].media[task.mediaId].location.remote =
						task.downloadUrl;
				});

				audioTasks.forEach((task) => {
					if (task.slide === 'theme' && presToSave.theme?.audio) {
						presToSave.theme.audio.remote = task.downloadUrl;
					} else {
						presToSave.slides[task.slide as number].audio!.location.remote =
							task.downloadUrl;
					}
				});

				if (connected)
					database.uploadPresentation(
						remoteUser.uid,
						presToSave,
						(remotePresentation) => {
							ipcRenderer
								.invoke(
									MainProcessMethodIdentifiers.SaveChangesToPresentation,
									presentationId,
									remotePresentation,
									remotePresentation.remoteUpdate
								)
								.then(() => {
									setLocalSyncingQueue((curr) =>
										curr.filter(
											(task) => task.presentationId !== presentationId
										)
									);
									setSyncPaper(
										(curr) =>
											new Map([
												...curr,
												[
													remotePresentation.remoteId!,
													{
														name: remotePresentation.name,
														remoteId: remotePresentation.remoteId,
														remoteUpdate: remotePresentation.remoteUpdate,
													} as SyncPaperEntry,
												],
											])
									);
									callback(remotePresentation.remoteId!);
								});
						}
					);
			}
		);
	};

	const downloadAndUpdateLocalPresentation = useCallback(
		(
			remoteId: string,
			presentations: StoredPresentation[],
			callback: (id: number) => void
		) => {
			if (remoteUser === undefined) return;
			setDownloadingPresentations((curr) => [...curr, remoteId]);
			if (connected)
				database
					.getRemotePresentation(remoteUser.uid, remoteId)
					.then((snapshot) => {
						if (snapshot.exists()) {
							const remotePresentation = snapshot.val() as SinglePresentation;
							const id = presentations.find(
								(pres) => pres.remoteId === remoteId
							)?.id;
							if (id === undefined) {
								ipcRenderer
									.invoke(
										MainProcessMethodIdentifiers.CreatePresentation,
										remotePresentation,
										remotePresentation.remoteUpdate
									)
									.then((storedPres: StoredPresentation) => {
										setDownloadingPresentations((curr) =>
											curr.filter((id) => id !== remoteId)
										);
										callback(storedPres.id);
									});
							} else {
								ipcRenderer
									.invoke(
										MainProcessMethodIdentifiers.SaveChangesToPresentation,
										id,
										remotePresentation,
										remotePresentation.remoteUpdate
									)
									.then((_: any) => {
										setDownloadingPresentations((curr) =>
											curr.filter((id) => id !== remoteId)
										);
										callback(id);
									});
							}
						}
					});
		},
		[remoteUser, database, connected, setDownloadingPresentations, ipcRenderer]
	);

	return {
		syncPaper,
		localSyncingQueue,
		addToLocalSyncingQueue,
		getRemotePresentationsFromSyncPaper,
		clear,
		presProgess,
		downloadAndUpdateLocalPresentation,
		downloadingPresentations,
	};
};

export default usePresentationSyncing;
