import React, {
	createContext,
	PropsWithChildren,
	useState,
	useEffect,
} from 'react';
import useRemoteUserContext from '../hooks/useRemoteUserContext';
import { storage } from '../models/firebase';
import { syncLocalPresentation } from '../models/PresentationSyncer';
import { SinglePresentation } from '../shared/types/presentation';
import {
	LocalSyncPresentationItem,
	RemotelyAvailableMedia,
} from '../types/presentaitonSycncing';

export const PresentationSyncContext = createContext({});

const PresentationSyncProvider: React.FC<PropsWithChildren<{}>> = ({
	children,
}) => {
	const { remoteUser, userLoggedIn } = useRemoteUserContext();
	const [remoteMedia, setRemoteMedia] = useState<RemotelyAvailableMedia[]>([]);
	const [localSyncingQueue, setLocalSyncingQueue] = useState<
		LocalSyncPresentationItem[]
	>([]);

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
		}

		return () => {};
	}, [remoteUser, userLoggedIn]);

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
				const newSyncQueue = [...localSyncingQueue];
				const index = localSyncingQueue.findIndex(
					(item) => item.presentationId === presentationId
				);
				newSyncQueue[index] = { ...newSyncQueue[index], progress: progress };
				setLocalSyncingQueue(newSyncQueue);

				console.log(progress);
			},
			(tasks) => {
				console.log(tasks);
			}
		);
	};

	return (
		<PresentationSyncContext.Provider
			value={{
				remoteMedia: remoteMedia,
				localSyncingQueue: localSyncingQueue,
				addToLocalSyncingQueue: addToLocalSyncingQueue,
				syncingAvailable: userLoggedIn,
			}}
		>
			{children}
		</PresentationSyncContext.Provider>
	);
};

export default PresentationSyncProvider;
