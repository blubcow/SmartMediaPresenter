import React, { useEffect, useState, useCallback } from 'react';
import Modal from '../../smpUI/Modal';
import Text from '../../smpUI/Text';
import { IModalProps } from '../../smpUI/Modal';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../i18n/i18n';
import { Button, CircularProgress, Divider, IconButton, LinearProgress } from '@mui/material';
import { CreateNewFolder, UploadFile, Delete } from '@mui/icons-material';
import usePresentationSyncContext from '../../hooks/usePresentationSyncContext';
import {
	RemoteStorageMedia,
	RemoteStorageMediaType,
} from '../../shared/presentaitonSycncing.interface';
import { useHeldKeys } from '../../hooks/useHeldKeys';
import { InsertDriveFile, Folder, ArrowBack } from '@mui/icons-material';
import { ImageResourceExtensions } from '../../shared/mediaResource.utils';
import { useLocalFileSystem } from '../../hooks/useMainProcessMethods';
import RemoteFile from './RemoteFile';
import { createStyles, makeStyles } from '@mui/styles';
import { Theme } from '@mui/material';
import { Box } from '@mui/material';
import ProgressButton from '../../smpUI/ProgressButton';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		container: {
			width: '850px',
			height: '70vh',
			display: 'flex',
			flexDirection: 'column',
			overflowX: 'visible',
		},
		header: {
			display: 'flex',
			justifyContent: 'space-between',
			alignItems: 'center',
			paddingBottom: theme.spacing(3),
		},
		headerBtnContainer: {
			display: 'flex',
			alignItems: 'center',
			gap: theme.spacing(1),
		},
		btnIcon: {
			marginRight: theme.spacing(0.5),
		},
		content: {
			flex: 1,
			position: 'relative',
			display: 'grid',
			gridTemplateColumns: 'repeat(5, 1fr)',
			gridAutoRows: 'minmax(min-content, max-content)',
			gridGap: theme.spacing(3),
			paddingTop: theme.spacing(3),
			paddingBottom: theme.spacing(3),
			padding: theme.spacing(1),
			overflowY: 'scroll',
		},
		loadingIndicator: {
			position: 'absolute',
			top: '50%',
			left: '50%',
			transform: 'translate(-50%, -50%)',
		},
		emptyFolderIndicator: {
			position: 'absolute',
			top: '50%',
			left: '50%',
			transform: 'translate(-50%, -50%)',
		},
		footerBtnContainer: {
			display: 'flex',
			justifyContent: 'space-between',
			alignItems: 'center',
			paddingTop: theme.spacing(3),
		},
		folderNavigator: {
			display: 'flex',
			gap: theme.spacing(1),
			alignItems: 'center',
		},
		newFolderContainer: {
			display: 'flex',
			flexDirection: 'column',
			gap: theme.spacing(3),
			justifyContent: 'center',
			alignItems: 'center',
			textAlign: 'center',
			width: '250px',
		},
		activityModal: {
			display: 'flex',
			flexDirection: 'column',
			gap: theme.spacing(3),
			justifyContent: 'center',
			alignItems: 'center',
		},
	})
);

interface IRemoteMediaModalProps extends IModalProps {}

const RemoteMediaModal: React.FC<IRemoteMediaModalProps> = (props) => {
	const { t } = useTranslation([i18nNamespace.Remote]);
	const { getRemoteMedia, createFolder, deleteFiles, uploadRemoteMedia } =
		usePresentationSyncContext();
	const classes = useStyles();
	const { shift } = useHeldKeys();

	const [loading, setLoading] = useState<boolean>(true);
	const [currentItems, setCurrentItems] = useState<RemoteStorageMedia[]>([]);
	const [history, setHistory] = useState<
		{ folder: string; path: string; files: RemoteStorageMedia[] }[]
	>([]);
	const [currentSelection, setCurrentSelection] = useState<
		RemoteStorageMedia[]
	>([]);
	const [currentPath, setCurrentPath] = useState<string>('');

	const [openNewFolderModal, setOpenNewFolderModal] = useState<boolean>(false);
	const [creatingFolder, setCreatingFolder] = useState<boolean>(false);
	const [newFolderName, setNewFolderName] = useState<string | undefined>();

	const [deletingMedia, setDeletingMedia] = useState<boolean>(false);

	const { openFileSelectorDialog } = useLocalFileSystem();

	const clearSelection = () => setCurrentSelection([]);

	const [uploadingMedia, setUploadingMedia] = useState<boolean>(false);
	const [uploadProgress, setUploadProgress] = useState<number>(0);

	useEffect(() => {
		getRemoteMedia((files) => {
			setCurrentItems(files);
			setLoading(false);
		});
	}, []);

	useEffect(() => {
		clearSelection();
	}, [history]);

	useEffect(() => {
		setNewFolderName(undefined);
	}, [openNewFolderModal]);

	return (
		<Modal {...props} maxWidth={false}>
			<Box className={classes.container} onClick={clearSelection}>
				<Box className={classes.header}>
					<Text fontWeight='bold' variant='h5'>
						{t('manageRemoteMedia')}
					</Text>
					<Box className={classes.headerBtnContainer}>
						<Button
							variant='contained'
							size='small'
							onClick={() => {
								setOpenNewFolderModal(true);
							}}
						>
							<CreateNewFolder className={classes.btnIcon} />
							{t('newFolder')}
						</Button>
						<Button
							variant='contained'
							size='small'
							onClick={() => {
								openFileSelectorDialog('remote').then((files: any[]) => {
									setUploadingMedia(true);
									uploadRemoteMedia(
										files.map((file) => file.location.local),
										(progress) => {
											setUploadProgress(progress);
										},
										(media: RemoteStorageMedia[]) => {
											setCurrentItems((curr) => [...curr, ...media]);
											setUploadingMedia(false);
											setUploadProgress(0);
										},
										currentPath
									);
								});
							}}
						>
							<UploadFile className={classes.btnIcon} />
							{t('uploadMedia')}
						</Button>
						<Button
							variant='contained'
							size='small'
							color='secondary'
							disabled={currentSelection.length === 0}
							onClick={() => {
								setDeletingMedia(true);
								deleteFiles(currentSelection, () => {
									setCurrentItems((curr) => [
										...curr
											.filter(
												(item) =>
													currentSelection.find(
														(sel) => sel.name === item.name
													) === undefined
											)
											.map((item) => ({ ...item })),
									]);
									setDeletingMedia(false);
								});
							}}
						>
							<Delete className={classes.btnIcon} />
							{t('delete')}
						</Button>
					</Box>
				</Box>
				<Divider />
				<Box className={classes.content}>
					{loading ? (
						<Box className={classes.loadingIndicator}>
							<CircularProgress />
						</Box>
					) : (
						<>
							{currentItems.length > 0 ? (
								currentItems.map((item) => (
									<RemoteFile
										key={item.name}
										selected={
											currentSelection.find((sel) => sel.name === item.name) !==
											undefined
										}
										onClick={() => {
											setCurrentSelection((curr) => [
												{ ...item },
												...(shift ? curr : []),
											]);
										}}
										name={item.name}
										imgUrl={item.url}
										type={item.type}
										changeDir={() => {
											setHistory([
												...history.map((h) => ({
													...h,
													files: h.files.map((f) => ({ ...f })),
												})),
												{
													folder: item.name,
													path: currentPath,
													files: [...currentItems.map((item) => ({ ...item }))],
												},
											]);
											setCurrentPath(item.path);
											setLoading(true);

											getRemoteMedia((files) => {
												setCurrentItems(files);
												setLoading(false);
											}, item.path);
										}}
									/>
								))
							) : (
								<Text variant='h6' className={classes.emptyFolderIndicator}>
									{t('emptyFolder')}
								</Text>
							)}
						</>
					)}
				</Box>
				<Divider />
				<Box className={classes.footerBtnContainer}>
					<Box>
						{history.length > 0 && (
							<Box className={classes.folderNavigator}>
								<IconButton
									onClick={() => {
										if (history.length > 0) {
											setCurrentPath(history[history.length - 1].path);
											const newItems = history[history.length - 1];
											setCurrentItems([
												...newItems.files.map((f) => ({ ...f })),
											]);
											const newHistory = [
												...history.map((h) => ({
													...h,
													files: h.files.map((f) => ({ ...f })),
												})),
											];
											newHistory.pop();
											setHistory(newHistory);
										}
									}}
								><ArrowBack/></IconButton>
								<Text variant='h5'>{history[history.length - 1].folder}</Text>
							</Box>
						)}
					</Box>
					<Button
						variant='contained'
						size='small'
						color='secondary'
						onClick={() => {
							if (props.onClose) props.onClose({}, 'backdropClick');
						}}
					>
						{t('close')}
					</Button>
				</Box>
			</Box>
			{openNewFolderModal && (
				<Modal
					open={openNewFolderModal}
					onClose={() => {
						if (!creatingFolder) setOpenNewFolderModal(false);
					}}
				>
					<Box className={classes.newFolderContainer}>
						<Text variant='h6' fontWeight={800}>
							{t('createNewFolder')}
						</Text>
						<Text
							placeholder={t('name')}
							editable
							align='center'
							color={newFolderName !== undefined ? 'text.primary' : 'GrayText'}
							style={{ maxWidth: '70%' }}
							editableTextDidChange={(_, curr) => setNewFolderName(curr)}
						></Text>
						<Box>
							<ProgressButton
								isLoading={creatingFolder}
								variant='contained'
								onClick={() => {
									if (newFolderName !== undefined) {
										setCreatingFolder(true);
										createFolder(
											newFolderName,
											(folder) => {
												setCurrentItems((curr) => [...curr, { ...folder }]);
												setOpenNewFolderModal(false);
												setCreatingFolder(false);
											},
											currentPath
										);
									}
								}}
							>
								{t('create')}
							</ProgressButton>
						</Box>
					</Box>
				</Modal>
			)}
			{deletingMedia && (
				<Modal open={true}>
					<Box className={classes.activityModal}>
						<Text variant='h6' fontWeight={800}>
							{t('deletingMedia')}
						</Text>
						<CircularProgress />
					</Box>
				</Modal>
			)}
			{uploadingMedia && (
				<Modal open={true}>
					<Box className={classes.activityModal}>
						<Text variant='h6' fontWeight={800}>
							{t('uploadingMedia')}
						</Text>
						<Box sx={{ width: '100%' }}>
							<LinearProgress
								value={uploadProgress}
								variant='determinate'
								sx={{ width: '100%' }}
							/>
						</Box>
					</Box>
				</Modal>
			)}
		</Modal>
	);
};

export default RemoteMediaModal;
