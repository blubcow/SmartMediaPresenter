import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';
import { MediaRessource } from '../../../shared/types/presentation';
import { Box, Text } from '../../../smpUI/components';
import useStyles from './styles';

interface IMediaDropBox {
	id: number;
	didReceiveMediaFile?: (file: File, id: number) => void;
	width: string;
	aspectRatio: string;
	canReceiveMedia?: boolean;
	media?: MediaRessource;
	isActive?: boolean;
	activateMedia?: (id: number) => void;
	onMediaSceletionBlur?: () => void;
}

const MediaDropBox: React.FC<IMediaDropBox> = (props) => {
	const {
		id,
		didReceiveMediaFile,
		width,
		aspectRatio,
		canReceiveMedia = true,
		media,
		isActive,
		activateMedia,
		onMediaSceletionBlur,
	} = props;
	const classes = useStyles();
	const { t } = useTranslation([i18nNamespace.Presentation]);

	return (
		<Box
			sx={{
				maxWidth: width,
				maxHeight:
					media?.location.local || media?.location.remote ? '100%' : undefined,
				aspectRatio:
					media?.location.local || media?.location.remote
						? undefined
						: aspectRatio,
				padding: media?.location.local || media?.location.remote ? 0 : 0.5,
				cursor: 'pointer',
				height:
					media?.location.local || media?.location.remote ? '100%' : undefined,
				width:
					media?.location.local || media?.location.remote ? undefined : '100%',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				overflow: 'visible',
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
				if (didReceiveMediaFile)
					didReceiveMediaFile(e.dataTransfer.files[0], id);
			}}
		>
			{media?.location.local || media?.location.remote ? (
				<img
					className={isActive ? classes.imgSelected : classes.img}
					src={media.location.local ?? media.location.remote}
					onClick={() => {
						if (activateMedia) activateMedia(id);
					}}
					onBlur={() => {
						if (onMediaSceletionBlur) onMediaSceletionBlur();
					}}
					tabIndex={id}
				/>
			) : (
				<Box
					className={classes.droppingArea}
					sx={{
						padding: media?.location.local || media?.location.remote ? 0 : 1,
					}}
				>
					{canReceiveMedia && (
						<Box className={classes.droppingAreaFrame}>
							<Text>{t('dropMediaHere')}</Text>
							<Text variant='caption'>
								{t('orClickToChooseFromFileInspector')}
							</Text>
						</Box>
					)}
				</Box>
			)}
		</Box>
	);
};

export default MediaDropBox;
