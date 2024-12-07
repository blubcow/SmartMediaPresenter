import { ArrowBack, Folder } from '@mui/icons-material';
import { Box, CircularProgress, ClickAwayListener, IconButton } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHeldKeys, usePresentationSyncContext } from '../../hooks';
import { i18nNamespace } from '../../i18n/i18n';
import { DataTransferIdentifiers } from '../../shared/identifiers.enum';
import { ImageResourceExtensions } from '../../shared/mediaResource.utils';
import { RemoteStorageMedia } from '../../shared/presentaitonSycncing.interface';
import { EditableText } from '../../smpUI/EditableText';
import { useRemoteFileExplorerStyles } from './styles';

interface IRemoteFileExplorerProps {
	preview: boolean;
	setMultiInsertionEnabled: (enabled: boolean) => void;
}

const RemoteFileExplorer: React.FC<IRemoteFileExplorerProps> = (props) => {
	const { preview, setMultiInsertionEnabled } = props;
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

	useEffect(() => {
		setMultiInsertionEnabled(selection.length > 1);
	}, [selection]);

	return (
		<Box className={classes.container}>
			{pathHistory.length > 0 && (
				<Box className={classes.navigator}>
					<IconButton
						onClick={() => {
							if (pathHistory.length > 0) {
								const newPath = pathHistory.pop()!;
								setCurrentPath(newPath);
							}
						}}
					><ArrowBack/></IconButton>
					<EditableText>{currentPath.split('/').pop() ?? ''}</EditableText>
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
										if (shift) {
											const highestIndex = Math.max(...selection);
											const lowestIndex = Math.min(...selection);

											if (!(index > highestIndex || index < lowestIndex))
												return;
											const start =
												index > highestIndex ? highestIndex + 1 : index;
											const end =
												index > highestIndex ? index + 1 : lowestIndex;
											const selectAllRowBetween = Array.from(
												{ length: end - start },
												(_, index) => start + index
											);
											setSelection([...selection, ...selectAllRowBetween]);
										} else {
											setSelection([index]);
										}
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
									<EditableText>{item.name}</EditableText>
								</Box>
							</Box>
						))}
					</Box>
				</ClickAwayListener>
			) : (
				<EditableText variant='h6' className={classes.inidicator}>
					{t('emptyFolder')}
				</EditableText>
			)}
		</Box>
	);
};

export default RemoteFileExplorer;
