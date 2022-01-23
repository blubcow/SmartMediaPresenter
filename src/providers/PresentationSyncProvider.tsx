import React, {
	createContext,
	PropsWithChildren,
	useState,
	useEffect,
	useCallback,
} from 'react';
import { CircularProgress, LinearProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import useRemoteUserContext from '../hooks/useRemoteUserContext';
import { i18nNamespace } from '../i18n/i18n';
import { storage, database } from '../models/firebase';
import { syncLocalPresentation } from '../models/PresentationSyncer';
import {
	SinglePresentation,
	StoredPresentation,
} from '../shared/types/presentation';
import { Box, Text } from '../smpUI/components';
import {
	LocalSyncPresentationItem,
	RemotelyAvailableMedia,
	SyncableStoredPresentation,
	SyncPaperEntry,
} from '../types/presentaitonSycncing';
import { MainProcessMethodIdentifiers } from '../shared/types/identifiers';
import { useStoredPresentations } from '../hooks/useMainProcessMethods';
import { useWorkspace } from '../hooks/useMainProcessMethods';
import ImportLocalPresentationsModal from '../views/components/modals/ImportLocalPresentationsModal';
import useUserSettingsContext from '../hooks/useUserSettingsContext';
import useConnectivityContext from '../hooks/useConnectivityContext';
import useRemoteMedia from '../hooks/useRemoteMedia';
const { ipcRenderer } = window.require('electron');
export const PresentationSyncContext = createContext({});

const PresentationSyncProvider: React.FC<PropsWithChildren<{}>> = ({
	children,
}) => {
	const { remoteUser, userLoggedIn } = useRemoteUserContext();
	const { connected } = useConnectivityContext();
	const [syncPaper, setSyncPaper] = useState<Map<string, SyncPaperEntry>>(
		new Map()
	);
	const [remoteMedia, setRemoteMedia] = useState<RemotelyAvailableMedia[]>([]);
	const [presProgess, setProgress] = useState<Map<number, number>>(new Map());
	const [downloadingPresentations, setDownloadingPresentations] = useState<
		string[]
	>([]);
	const [syncingAvailable, setSyncingAvailable] = useState<boolean>(false);
	const [localSyncingQueue, setLocalSyncingQueue] = useState<
		LocalSyncPresentationItem[]
	>([]);
	const [importPresentationsOpen, setImportPresentationOpen] =
		useState<boolean>(false);
	const [localPresentationsAmnt, setLocalPresentationsAmnt] = useState<
		number | undefined
	>();
	const [importingLocalPresentations, setImportingLocalPresentations] =
		useState<boolean>(false);
	const {
		presentations,
		createPresentation,
		createQuickCreatePresentation,
		retrieveSinglePresentationOnce,
		removeSinglePresentation,
		reloadPresentations,
		removeRemoteAttributesFromPresentation,
	} = useStoredPresentations();
	const { changeCurrentWorkspace, importLocalPresentations } = useWorkspace();
	const { reloadUserSettings } = useUserSettingsContext();
	const { uploadRemoteMedia, deleteRemoteFiles, createFolder, getRemoteMedia } =
		useRemoteMedia(remoteUser);

	const [storedPresentations, setStoredPresentations] = useState<
		SyncableStoredPresentation[]
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
		[remoteUser]
	);

	useEffect(() => {
		if (remoteUser && userLoggedIn) {
			storage.listRemoteMedia(remoteUser.uid).then((media) =>
				Promise.all(
					media.items.map(async (item) => {
						const fileName = item.fullPath.split('/').pop()!;
						return {
							name: fileName,
							downloadUrl: await storage.getDownloadUrlFromFileName(
								remoteUser.uid,
								fileName
							),
						};
					})
				).then((r) => setRemoteMedia(r))
			);

			getRemotePresentationsFromSyncPaper(() => {
				setSyncingAvailable(userLoggedIn && connected);
			});
		} else {
			setRemoteMedia([]);
			setProgress(new Map());
			setSyncPaper(new Map());
			setLocalSyncingQueue([]);
			setSyncingAvailable(false);
		}
	}, [remoteUser, userLoggedIn, connected]);

	useEffect(() => {
		changeCurrentWorkspace(
			(canImport, amnt) => {
				setLocalPresentationsAmnt(amnt);
				setImportPresentationOpen(canImport);
				reloadPresentations();
				reloadUserSettings();
			},
			remoteUser ? remoteUser.uid : undefined
		);
	}, [remoteUser]);

	const addToLocalSyncingQueue = (
		presentation: SinglePresentation,
		presentationId: number
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
				// @ts-ignore
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
												// @ts-ignore
												...curr,
												[
													remotePresentation.remoteId,
													{
														name: remotePresentation.name,
														remoteId: remotePresentation.remoteId,
														remoteUpdate: remotePresentation.remoteUpdate,
													},
												],
											])
									);
									reloadPresentations();
								});
						}
					);
			}
		);
	};

	const deleteRemotePresentation = useCallback(
		(remoteId: string) => {
			if (remoteUser === undefined) return;

			if (connected)
				database.deleteRemotePresentation(remoteUser.uid, remoteId).then(() => {
					reloadPresentations();
					getRemotePresentationsFromSyncPaper();
				});
		},
		[remoteUser]
	);

	const sortStoredPresentations = (
		storedPresentations: SyncableStoredPresentation[]
	): SyncableStoredPresentation[] => {
		return storedPresentations.sort((a, b) => {
			if (a.created === undefined && b.created === undefined) {
				return b.remoteUpdate! > a.remoteUpdate! ? 1 : -1;
			} else if (a.created === undefined) {
				return b.created! > a.remoteUpdate! ? 1 : -1;
			} else if (b.created === undefined) {
				return b.remoteUpdate! > a.created! ? 1 : -1;
			}

			return b.created! > a.created! ? 1 : -1;
		});
	};

	const retrieveRemotePresentationOnce = (
		remoteId: string,
		callback: (pres: SinglePresentation) => void
	) => {
		if (!syncingAvailable) return;

		if (connected)
			database
				.getRemotePresentation(remoteUser!.uid, remoteId)
				.then((snapshot) => {
					if (snapshot.exists()) {
						callback(snapshot.val() as SinglePresentation);
					}
				});
	};

	const downloadAndUpdateLocalPresentation = (remoteId: string) => {
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
									reloadPresentations();
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
									reloadPresentations();
								});
						}
					}
				});
	};

	useEffect(() => {
		const remotePresentations = Array.from(syncPaper.values());
		const p = sortStoredPresentations([
			...presentations.map(
				(pres) => ({ ...pres } as SyncableStoredPresentation)
			),
			...remotePresentations
				.filter(
					(pres) =>
						presentations.find(
							(localPres) => localPres.remoteId === pres.remoteId
						) === undefined
				)
				.map((pres) => ({ ...pres } as SyncableStoredPresentation)),
		]);
		setStoredPresentations(p);
	}, [presentations, syncPaper]);

	return (
		<PresentationSyncContext.Provider
			value={{
				storedPresentations: storedPresentations,
				createPresentation: createPresentation,
				createQuickCreatePresentation: createQuickCreatePresentation,
				removeSinglePresentation: removeSinglePresentation,
				retrieveSinglePresentationOnce: retrieveSinglePresentationOnce,
				remoteMedia: remoteMedia,
				localSyncingQueue: localSyncingQueue,
				addToLocalSyncingQueue: addToLocalSyncingQueue,
				syncPaper: syncPaper,
				syncingAvailable: syncingAvailable,
				retrieveRemotePresentationOnce: retrieveRemotePresentationOnce,
				downloadAndUpdateLocalPresentation: downloadAndUpdateLocalPresentation,
				downloadingPresentations: downloadingPresentations,
				getRemoteMedia: getRemoteMedia,
				createFolder: createFolder,
				deleteFiles: deleteRemoteFiles,
				uploadRemoteMedia: uploadRemoteMedia,
				deleteRemotePresentation: deleteRemotePresentation,
				removeRemoteAttributesFromPresentation:
					removeRemoteAttributesFromPresentation,
			}}
		>
			<Box
				sx={{
					position: 'absolute',
					height: '100vh',
					width: '100vw',
					display: 'flex',
					flexDirection: 'column-reverse',
					gap: 2,
					paddingLeft: 5,
					paddingBottom: 2,
				}}
			>
				{localSyncingQueue.map((task) => (
					<SyncingInfoToast
						name={task.presentation.name}
						progress={presProgess.get(task.presentationId) ?? 0}
						key={task.presentationId}
					/>
				))}
			</Box>
			{importPresentationsOpen && localPresentationsAmnt !== undefined && (
				<ImportLocalPresentationsModal
					open={true}
					importing={importingLocalPresentations}
					onChoose={(importPresentations: boolean) => {
						if (importPresentations) {
							setImportingLocalPresentations(true);
							importLocalPresentations(() => {
								reloadPresentations();
								setImportPresentationOpen(false);
								setImportingLocalPresentations(false);
							});
						} else {
							setImportPresentationOpen(false);
						}
					}}
					amnt={localPresentationsAmnt}
				/>
			)}
			{children}
		</PresentationSyncContext.Provider>
	);
};

interface ISyncingInfoToastProps {
	name: string;
	progress: number;
}

const SyncingInfoToast: React.FC<ISyncingInfoToastProps> = (props) => {
	const { name, progress } = props;
	const { t } = useTranslation([i18nNamespace.Presentation]);

	return (
		<Box
			sx={{
				width: '400px',
				height: '100px',
				bgcolor: 'background.paper',
				borderRadius: 1,
				padding: 2,
				zIndex: 1000,
				boxShadow: 10,
				display: 'flex',
				flexDirection: 'column',
				pointerEvents: 'none',
			}}
			onClick={() => {}}
		>
			<Box
				sx={{
					display: 'flex',
					gap: 1,
					flex: 1,
					alignItems: 'center',
					justifyContent: 'space-between',
				}}
			>
				<Text>{`${name} ${t('syncToCloud')}`}</Text>
				<CircularProgress variant='indeterminate' />
			</Box>

			<LinearProgress
				value={progress}
				variant='determinate'
				sx={{ width: '100%' }}
			/>
		</Box>
	);
};

export default PresentationSyncProvider;
