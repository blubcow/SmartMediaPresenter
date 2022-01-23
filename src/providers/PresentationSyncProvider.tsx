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
import { database } from '../models/firebase';
import {
	SinglePresentation,
	StoredPresentation,
} from '../shared/types/presentation';
import { Box, Text } from '../smpUI/components';
import { SyncableStoredPresentation } from '../types/presentaitonSycncing';
import { MainProcessMethodIdentifiers } from '../shared/types/identifiers';
import { useStoredPresentations } from '../hooks/useMainProcessMethods';
import { useWorkspace } from '../hooks/useMainProcessMethods';
import ImportLocalPresentationsModal from '../views/components/modals/ImportLocalPresentationsModal';
import useUserSettingsContext from '../hooks/useUserSettingsContext';
import useConnectivityContext from '../hooks/useConnectivityContext';
import useRemoteMedia from '../hooks/useRemoteMedia';
import usePresentationSyncing from '../hooks/usePresentationSyncing';
import { clear } from 'console';
const { ipcRenderer } = window.require('electron');
export const PresentationSyncContext = createContext({});

const PresentationSyncProvider: React.FC<PropsWithChildren<{}>> = ({
	children,
}) => {
	const { remoteUser, userLoggedIn } = useRemoteUserContext();
	const { connected } = useConnectivityContext();

	const [downloadingPresentations, setDownloadingPresentations] = useState<
		string[]
	>([]);
	const [syncingAvailable, setSyncingAvailable] = useState<boolean>(false);

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
	const {
		remoteMedia,
		uploadRemoteMedia,
		deleteRemoteFiles,
		createFolder,
		getRemoteMedia,
	} = useRemoteMedia(remoteUser);
	const {
		syncPaper,
		getRemotePresentationsFromSyncPaper,
		addToLocalSyncingQueue,
		localSyncingQueue,
		clear,
		presProgess,
	} = usePresentationSyncing(connected, remoteUser);

	const [storedPresentations, setStoredPresentations] = useState<
		SyncableStoredPresentation[]
	>([]);

	useEffect(() => {
		if (remoteUser && userLoggedIn) {
			getRemotePresentationsFromSyncPaper(() => {
				setSyncingAvailable(userLoggedIn && connected);
			});
		} else {
			clear();
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
				addToLocalSyncingQueue: (
					presentation: SinglePresentation,
					presentationId: number
				) => {
					addToLocalSyncingQueue(
						presentation,
						presentationId,
						remoteMedia,
						() => {
							reloadPresentations();
						}
					);
				},
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
