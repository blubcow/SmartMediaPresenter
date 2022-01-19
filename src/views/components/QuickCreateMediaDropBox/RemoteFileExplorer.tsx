import React, { useState, useEffect } from 'react';
import { Box, IconButton, Text } from '../../../smpUI/components';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';
import { RemoteStorageMedia } from '../../../types/presentaitonSycncing';
import { useRemoteFileExplorerStyles } from './styles';
import { CircularProgress, ClickAwayListener } from '@mui/material';
import usePresentationSyncContext from '../../../hooks/usePresentationSyncContext';
import { ImageResourceExtensions } from '../../../shared/types/mediaResources';
import { useHeldKeys } from '../../../hooks/useHeldKeys';
import { Folder, ArrowBack } from '@mui/icons-material';
import { DataTransferIdentifiers } from '../../../types/identifiers';

interface IRemoteFileExplorerProps {
	preview: boolean;
}

const RemoteFileExplorer: React.FC<IRemoteFileExplorerProps> = (props) => {
	const { preview } = props;
	const { t } = useTranslation([i18nNamespace.Remote]);
	const classes = useRemoteFileExplorerStyles();
	const { getRemoteMedia } = usePresentationSyncContext();
	const { shift } = useHeldKeys();

	const [loadingMedia, setLoadingMedia] = useState<boolean>(true);
	const [currentItems, setCurrentItems] = useState<RemoteStorageMedia[]>([]);
	const [selection, setSelection] = useState<number[]>([]);
	const [currentPath, setCurrentPath] = useState<string>('');
	const [pathHistory, setPathHistory] = useState<string[]>([]);

	useEffect(() => {
		setLoadingMedia(true);
		setSelection([]);
		getRemoteMedia((files) => {
			setCurrentItems(
				files.filter(
					(file) =>
						ImageResourceExtensions.includes(
							(file.name.split('.').pop() ?? '').toLowerCase()
						) || file.type === 'dir'
				)
			);
			setLoadingMedia(false);
		}, currentPath);
	}, [currentPath]);

	return (
		<Box className={classes.container}>
			{pathHistory.length > 0 && (
				<Box className={classes.navigator}>
					<IconButton
						icon={ArrowBack}
						onClick={() => {
							if (pathHistory.length > 0) {
								const newPath = pathHistory.pop()!;
								setCurrentPath(newPath);
							}
						}}
					/>
					<Text>{currentPath.split('/').pop() ?? ''}</Text>
				</Box>
			)}
			{loadingMedia ? (
				<Box className={classes.inidicator}>
					<CircularProgress />
				</Box>
			) : currentItems.length > 0 ? (
				<ClickAwayListener onClickAway={() => setSelection([])}>
					<Box>
						{currentItems.map((item, index) => (
							<Box
								className={classes.row}
								draggable
								onDragStart={(e) => {
									if (selection.length > 1) {
										e.dataTransfer.setData(
											DataTransferIdentifiers.MulitpleRemoteMediaFileInfo,
											JSON.stringify(
												selection
													.filter(
														(index) => currentItems[index].url !== undefined
													)
													.map((index) => currentItems[index].url)
											)
										);
									} else {
										if (item.url)
											e.dataTransfer.setData(
												DataTransferIdentifiers.RemoteMediaFileInfo,
												item.url
											);
									}
								}}
								onClick={() => {
									if (item.type === 'file') {
										setSelection((curr) => [...(shift ? curr : []), index]);
									}
								}}
								onDoubleClick={() => {
									if (item.type === 'dir') {
										setPathHistory((curr) => [...curr, currentPath]);
										setCurrentPath(item.path);
									}
								}}
								sx={{
									bgcolor: selection.includes(index)
										? 'primary.main'
										: index % 2
										? 'transparent'
										: 'divider',
								}}
							>
								<Box className={classes.imgContainer}>
									{item.type === 'dir' ? (
										<Folder className={classes.icon} />
									) : preview ? (
										<img
											className={classes.img}
											src={item.url}
											loading='lazy'
										/>
									) : (
										<></>
									)}
								</Box>
								<Box sx={{ userSelect: 'none', pointerEvents: 'none' }}>
									<Text>{item.name}</Text>
								</Box>
							</Box>
						))}
					</Box>
				</ClickAwayListener>
			) : (
				<Text variant='h6' className={classes.inidicator}>
					{t('emptyFolder')}
				</Text>
			)}
		</Box>
	);
};

export default RemoteFileExplorer;
