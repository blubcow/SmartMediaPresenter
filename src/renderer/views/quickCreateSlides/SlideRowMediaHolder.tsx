import React from 'react';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../i18n/i18n';
import { DataTransferIdentifiers } from '../../shared/identifiers.enum';
import { Box, Text } from '../../smpUI';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { createStyles, makeStyles } from '@mui/styles';
import { Theme } from '@mui/material';

const useSlideRowMediaHolderStyles = makeStyles((theme: Theme) =>
	createStyles({
		container: {
			height: '100%',
		},
		mediaPresentContainer: {
			height: '100%',
			width: '100%',
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			justifyContent: 'center',
		},
		mediaPresentImg: {
			maxHeight: '50%',
		},
		noMediaPresentContainer: {
			height: '100%',
			width: '100%',
			padding: theme.spacing(0.5),
		},
		noMediaPresentIndicatorBox: {
			height: '100%',
			width: '100%',
			backgroundColor: theme.palette.background.default,
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			borderRadius: theme.shape.borderRadius,
		},
	})
);

interface ISlideRowMediaHolder {
	id: number;
	src?: string;
	width: string;
	onMediaReceived: (id: number, path: string) => void;
}

const SlideRowMediaHolder: React.FC<ISlideRowMediaHolder> = (props) => {
	const { id, src, width, onMediaReceived } = props;
	const classes = useSlideRowMediaHolderStyles();
	const { t } = useTranslation([i18nNamespace.Presentation]);

	return (
		<Box
			className={classes.container}
			sx={{
				width: width,
			}}
			onDragOver={(e) => {
				e.preventDefault();
			}}
			onDragLeave={(e) => {
				e.preventDefault();
			}}
			onDragEnter={(e) => {
				e.preventDefault();
			}}
			onDrop={(e) => {
				e.preventDefault();
				let media;
				if (e.dataTransfer.getData(DataTransferIdentifiers.MediaFileInfo)) {
					media = JSON.parse(
						e.dataTransfer.getData(DataTransferIdentifiers.MediaFileInfo)
					);
				}
				if (
					e.dataTransfer.getData(DataTransferIdentifiers.RemoteMediaFileInfo)
				) {
					media = {
						location: {
							remote: e.dataTransfer.getData(
								DataTransferIdentifiers.RemoteMediaFileInfo
							),
						},
					};
				} else {
					media = {
						location: { local: 'file://' + e.dataTransfer.files[0].path },
					};
				}
				onMediaReceived(
					id,
					media.location.local ?? media.location.remote ?? ''
				);
			}}
		>
			{src ? (
				<Box className={classes.mediaPresentContainer}>
					<LazyLoadImage
						src={src}
						className={classes.mediaPresentImg}
						alt='media'
					/>
					<Text overflow='hidden' textOverflow='ellipsis' variant='caption'>
						{src.startsWith('http') ? t('cloudImage') : src.split('/').pop()}
					</Text>
				</Box>
			) : (
				<Box className={classes.noMediaPresentContainer}>
					<Box className={classes.noMediaPresentIndicatorBox}>
						<Text variant='caption'>{t('dropMediaHere')}</Text>
					</Box>
				</Box>
			)}
		</Box>
	);
};

export default SlideRowMediaHolder;
