import { ArrowBack } from '@mui/icons-material';
import { Box, Button, CircularProgress, Divider, IconButton, Theme } from '@mui/material';
import { createStyles, makeStyles } from '@mui/styles';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePresentationSyncContext } from '../../hooks';
import { i18nNamespace } from '../../i18n/i18n';
import {
	AudioResourceExtensions,
	ImageResourceExtensions,
} from '../../shared/mediaResource.utils';
import { RemoteStorageMedia } from '../../shared/presentaitonSycncing.interface';
import { BoxedDialog, EditableText, IBoxedDialogProps } from '../../smpUI';
import RemoteFile from './RemoteFile';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		container: {
			width: '50vw',
			height: '50vh',
			display: 'flex',
			flexDirection: 'column',
		},
		header: {
			width: '100%',
			paddingBottom: theme.spacing(3),
			display: 'flex',
			justifyContent: 'space-between',
			alignItems: 'center',
		},
		content: {
			width: '100%',
			flex: 1,
			position: 'relative',
			overflowY: 'scroll',
			padding: theme.spacing(3),
			display: 'grid',
			gridTemplateColumns: 'repeat(4, 1fr)',
			gridAutoRows: 'minmax(min-content, max-content)',
			gridGap: theme.spacing(3),
		},
		indicator: {
			position: 'absolute',
			left: '50%',
			top: '50%',
			transform: 'translate(-50%, -50%)',
		},
	})
);


interface IRemoteFileExplorerPorps extends IBoxedDialogProps {
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
		<BoxedDialog
			{...modalProps}
			maxWidth={false}
			PaperProps={{ onClick: () => setCurrentSelection(undefined) }}
		>
			<Box className={classes.container}>
				<Box className={classes.header}>
					<EditableText variant='h5' fontWeight={800}>
						{pathHistory.length > 0 && (
							<IconButton
								onClick={() => {
									if (pathHistory.length > 0) {
										const newPath = pathHistory.pop()!;
										setCurrentPath(newPath);
									}
								}}
							><ArrowBack/></IconButton>
						)}
						{currentPath.length === 0
							? t('chooseMedia')
							: currentPath.split('/').pop() ?? ''}
					</EditableText>
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
						<EditableText variant='h6' className={classes.indicator}>
							{t('emptyFolder')}
						</EditableText>
					) : (
						<>
							{currentItems.map((item) => (
								<RemoteFile
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
		</BoxedDialog>
	);
};

export default RemoteFileExplorer;
