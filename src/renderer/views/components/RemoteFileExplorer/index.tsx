import React, { useEffect, useState } from 'react';
import { CircularProgress, Divider } from '@mui/material';
import usePresentationSyncContext from '../../../hooks/usePresentationSyncContext';
import {
	Modal,
	Box,
	Button,
	Text,
	IconButton,
} from '../../../smpUI/components';
import { IModalProps } from '../../../smpUI/components/Modal';
import useStyles from './styles';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';
import { RemoteStorageMedia } from '../../../types/presentaitonSycncing';
import { File } from '../RemoteMediaModal';
import {
	AudioResourceExtensions,
	ImageResourceExtensions,
} from '../../../shared/types/mediaResources';
import { ArrowBack } from '@mui/icons-material';

interface IRemoteFileExplorerPorps extends IModalProps {
	filterItems?: 'audio' | 'image';
	onMediaChoosen: (remoteLocation: string) => void;
}

const RemoteFileExplorer: React.FC<IRemoteFileExplorerPorps> = (props) => {
	const { filterItems, onMediaChoosen, ...modalProps } = props;
	const classes = useStyles();

	const { getRemoteMedia } = usePresentationSyncContext();
	const { t } = useTranslation([i18nNamespace.Remote]);

	const [loadingMedia, setLoadingMedia] = useState<boolean>(true);
	const [currentPath, setCurrentPath] = useState<string>('');

	const [currentItems, setCurrentItems] = useState<RemoteStorageMedia[]>([]);
	const [currentSelection, setCurrentSelection] = useState<
		RemoteStorageMedia | undefined
	>();
	const [pathHistory, setPathHistory] = useState<string[]>([]);

	useEffect(() => {
		setLoadingMedia(true);
		setCurrentSelection(undefined);
		getRemoteMedia((files) => {
			setCurrentItems(
				filterItems
					? files.filter((file) => {
							const extension = (
								file.name.split('.').pop() ?? ''
							).toLowerCase();
							return (
								(filterItems === 'audio'
									? AudioResourceExtensions.includes(extension)
									: ImageResourceExtensions.includes(extension)) ||
								file.type === 'dir'
							);
					  })
					: files
			);
			setLoadingMedia(false);
		}, currentPath);
	}, [currentPath]);

	return (
		<Modal
			{...modalProps}
			maxWidth={false}
			PaperProps={{ onClick: () => setCurrentSelection(undefined) }}
		>
			<Box className={classes.container}>
				<Box className={classes.header}>
					<Text variant='h5' fontWeight={800}>
						{pathHistory.length > 0 && (
							<IconButton
								icon={ArrowBack}
								onClick={() => {
									if (pathHistory.length > 0) {
										const newPath = pathHistory.pop()!;
										setCurrentPath(newPath);
									}
								}}
							/>
						)}
						{currentPath.length === 0
							? t('chooseMedia')
							: currentPath.split('/').pop() ?? ''}
					</Text>
					<Button
						variant='contained'
						disabled={currentSelection?.type !== 'file'}
						onClick={() => {
							if (currentSelection?.url) onMediaChoosen(currentSelection.url);
						}}
					>
						{t('choose')}
					</Button>
				</Box>
				<Divider />
				<Box className={classes.content}>
					{loadingMedia ? (
						<Box className={classes.indicator}>
							<CircularProgress />
						</Box>
					) : currentItems.length === 0 ? (
						<Text variant='h6' className={classes.indicator}>
							{t('emptyFolder')}
						</Text>
					) : (
						<>
							{currentItems.map((item) => (
								<File
									name={item.name}
									selected={currentSelection?.name === item.name}
									onClick={() => setCurrentSelection(item)}
									changeDir={() => {
										setPathHistory((curr) => [...curr, currentPath]);
										setCurrentPath(item.path);
									}}
									type={item.type}
									imgUrl={item.url}
								/>
							))}
						</>
					)}
				</Box>
			</Box>
		</Modal>
	);
};

export default RemoteFileExplorer;
