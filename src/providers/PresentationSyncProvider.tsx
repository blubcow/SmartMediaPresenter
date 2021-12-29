import React, {
	createContext,
	PropsWithChildren,
	useState,
	useEffect,
} from 'react';
import { CircularProgress, LinearProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import useRemoteUserContext from '../hooks/useRemoteUserContext';
import { i18nNamespace } from '../i18n/i18n';
import { storage, database } from '../models/firebase';
import { syncLocalPresentation } from '../models/PresentationSyncer';
import { SinglePresentation } from '../shared/types/presentation';
import { Box, Text } from '../smpUI/components';
import {
	LocalSyncPresentationItem,
	RemotelyAvailableMedia,
} from '../types/presentaitonSycncing';
import { MainProcessMethodIdentifiers } from '../shared/types/identifiers';
const { ipcRenderer } = window.require('electron');

export const PresentationSyncContext = createContext({});

const PresentationSyncProvider: React.FC<PropsWithChildren<{}>> = ({
	children,
}) => {
	const { remoteUser, userLoggedIn } = useRemoteUserContext();
	const [syncPaper, setSyncPaper] = useState<Map<string, number>>(new Map());
	const [remoteMedia, setRemoteMedia] = useState<RemotelyAvailableMedia[]>([]);
	const [presProgess, setProgress] = useState<Map<number, number>>(new Map());
	const [syncingAvailable, setSyncingAvailable] = useState<boolean>(false);
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

			// TODO: move to inital loading screen
			database.getSyncPaper(remoteUser.uid).then((snapshot) => {
				if (snapshot.exists()) {
					const paper: any = snapshot.val();
					const paperMap = new Map();
					for (const key in paper) {
						paperMap.set(key, paper[key]);
					}
					setSyncPaper(paperMap);
					setSyncingAvailable(userLoggedIn);
				}
			});
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
				// @ts-ignore
				setProgress((curr) => new Map([...curr, [presentationId, progress]]));
			},
			(tasks) => {
				const presToSave = JSON.parse(
					JSON.stringify(presentation)
				) as SinglePresentation;
				tasks.forEach((task) => {
					presToSave.slides[task.slide].media[task.mediaId].location.remote =
						task.downloadUrl;
				});

				database.uploadPresentation(
					remoteUser.uid,
					presentation,
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
									curr.filter((task) => task.presentationId !== presentationId)
								);
							});
					}
				);
			}
		);
	};

	return (
		<PresentationSyncContext.Provider
			value={{
				remoteMedia: remoteMedia,
				localSyncingQueue: localSyncingQueue,
				addToLocalSyncingQueue: addToLocalSyncingQueue,
				syncPaper: syncPaper,
				syncingAvailable: syncingAvailable,
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
