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
import { RemoteStorageMedia } from '../../../types/presentaitonSycncing';
import { useHeldKeys } from '../../../hooks/useHeldKeys';
import { InsertDriveFile, Folder, ArrowBack } from '@mui/icons-material';
import { ImageResourceExtensions } from '../../../shared/types/mediaResources';

interface IRemoteMediaModalProps extends IModalProps {}

const RemoteMediaModal: React.FC<IRemoteMediaModalProps> = (props) => {
	const { t } = useTranslation([i18nNamespace.Remote]);
	const { getRemoteMedia } = usePresentationSyncContext();
	const classes = useStyles();
	const { shift } = useHeldKeys();

	const [loading, setLoading] = useState<boolean>(true);
	const [currentItems, setCurrentItems] = useState<RemoteStorageMedia[]>([]);
	const [history, setHistory] = useState<
		{ folder: string; files: RemoteStorageMedia[] }[]
	>([]);
	const [currentSelection, setCurrentSelection] = useState<string[]>([]);

	const clearSelection = () => setCurrentSelection([]);

	useEffect(() => {
		clearSelection();
		setLoading(true);
		setHistory([]);
		setCurrentItems([]);
		getRemoteMedia((files) => {
			setCurrentItems(files);
			setLoading(false);
		});
	}, [props.open]);

	useEffect(() => {
		clearSelection();
	}, [history]);

	return (
		<Modal {...props} maxWidth={false}>
			<Box className={classes.container} onClick={clearSelection}>
				<Box className={classes.header}>
					<Text fontWeight='bold' variant='h5'>
						{t('manageRemoteMedia')}
					</Text>
					<Box className={classes.headerBtnContainer}>
						<Button variant='contained' size='small'>
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
										selected={currentSelection.includes(item.name)}
										onClick={() => {
											setCurrentSelection((curr) => [
												item.name,
												...(shift ? curr : []),
											]);
										}}
										name={item.name}
										imgUrl={item.url}
										changeDir={() => {
											setHistory((curr) => [
												...curr,
												{ folder: item.name, files: [...currentItems] },
											]);
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
											setHistory((curr) => {
												setCurrentItems([...curr.pop()!.files]);
												return [...curr];
											});
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
		</Modal>
	);
};

interface IFileProps {
	name: string;
	imgUrl?: string;
	selected: boolean;
	onClick: () => void;
	changeDir: () => void;
}

const File: React.FC<IFileProps> = (props) => {
	const { name, imgUrl, selected, onClick, changeDir } = props;
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
				{fileExtension !== name ? (
					ImageResourceExtensions.includes(fileExtension) ? (
						<img className={classes.img} src={imgUrl} loading='lazy' />
					) : (
						<InsertDriveFile className={classes.icon} />
					)
				) : (
					<Folder className={classes.icon} />
				)}
			</Box>
			<Box className={classes.nameContainer}>{name}</Box>
		</Box>
	);
};

export default RemoteMediaModal;
