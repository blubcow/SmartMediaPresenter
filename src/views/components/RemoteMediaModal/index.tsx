import React, { useEffect, useState } from 'react';
import {
	Modal,
	Box,
	Button,
	Text,
	IconButton,
} from '../../../smpUI/components';
import { IModalProps } from '../../../smpUI/components/Modal';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';
import useStyles, { useFileStyles } from './styles';
import { CircularProgress, Divider } from '@mui/material';
import { CreateNewFolder, UploadFile, Delete } from '@mui/icons-material';
import usePresentationSyncContext from '../../../hooks/usePresentationSyncContext';
import {
	RemoteStorageMedia,
	RemoteStorageMediaType,
} from '../../../types/presentaitonSycncing';
import { useHeldKeys } from '../../../hooks/useHeldKeys';
import { InsertDriveFile, Folder, ArrowBack } from '@mui/icons-material';
import { ImageResourceExtensions } from '../../../shared/types/mediaResources';

interface IRemoteMediaModalProps extends IModalProps {}

const RemoteMediaModal: React.FC<IRemoteMediaModalProps> = (props) => {
	const { t } = useTranslation([i18nNamespace.Remote]);
	const { getRemoteMedia, createFolder, deleteFiles } =
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

	const clearSelection = () => setCurrentSelection([]);

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
						<Button variant='contained' size='small'>
							<UploadFile className={classes.btnIcon} />
							{t('uploadMedia')}
						</Button>
						<Button
							variant='contained'
							size='small'
							color='secondary'
							disabled={currentSelection.length === 0}
							onClick={() => {
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
									<File
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
									icon={ArrowBack}
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
								/>
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
							create new folder
						</Text>
						<Text
							placeholder='name'
							editable
							align='center'
							color={newFolderName !== undefined ? 'text.primary' : 'GrayText'}
							style={{ maxWidth: '70%' }}
							editableTextDidChange={(_, curr) => setNewFolderName(curr)}
						></Text>
						<Box>
							<Button
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
								create
							</Button>
						</Box>
					</Box>
				</Modal>
			)}
		</Modal>
	);
};

interface IFileProps {
	name: string;
	imgUrl?: string;
	selected: boolean;
	onClick: () => void;
	changeDir: () => void;
	type: RemoteStorageMediaType;
}

const File: React.FC<IFileProps> = (props) => {
	const { name, imgUrl, selected, onClick, changeDir, type } = props;
	const classes = useFileStyles();
	const [fileExtension] = useState<string>(name.split('.').pop() ?? '');

	return (
		<Box
			className={classes.container}
			sx={{
				backgroundColor: selected ? 'background.default' : undefined,
			}}
			onClick={(e) => {
				e.stopPropagation();
				onClick();
			}}
			onDoubleClick={(e) => {
				e.stopPropagation();
				if (fileExtension === name) changeDir();
			}}
		>
			<Box className={classes.fileTypeContainer}>
				{type !== 'dir' ? (
					ImageResourceExtensions.includes(fileExtension.toLowerCase()) ? (
						<img className={classes.img} src={imgUrl} loading='lazy' />
					) : (
						<InsertDriveFile className={classes.icon} />
					)
				) : (
					<Folder className={classes.icon} />
				)}
			</Box>
			<Text
				variant='caption'
				fontWeight={700}
				className={classes.nameContainer}
			>
				{name}
			</Text>
		</Box>
	);
};

export default RemoteMediaModal;
