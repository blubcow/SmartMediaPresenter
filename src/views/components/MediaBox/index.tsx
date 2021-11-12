import React from 'react';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';
import { MediaRessource } from '../../../shared/types/presentation';
import { Box } from '../../../smpUI/components';
import MediaDropBoxIndicator from '../MediaDropBoxIndicator';
import useStyles from './styles';

interface IMediaBox {
	id: number;
	width: string;
	aspectRatio: string;
	canReceiveMedia?: boolean;
	media?: MediaRessource;
	isActive?: boolean;
	activateMedia?: (id: number) => void;
	onMediaSelectionBlur?: () => void;
	didReceiveMediaFile?: (file: File, id: number) => void;
}

const MediaBox: React.FC<IMediaBox> = (props) => {
	const {
		id,
		didReceiveMediaFile,
		width,
		aspectRatio,
		canReceiveMedia = true,
		media,
		isActive,
		activateMedia,
		onMediaSelectionBlur,
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
				if (didReceiveMediaFile && canReceiveMedia)
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
						if (onMediaSelectionBlur) onMediaSelectionBlur();
					}}
					tabIndex={id}
				/>
			) : canReceiveMedia ? (
				<MediaDropBoxIndicator
					canTapToOpenFileInspector
					sx={{ bgcolor: 'divider' }}
				/>
			) : (
				<Box sx={{ height: '100%', width: '100%', bgcolor: 'divider' }} />
			)}
		</Box>
	);
};

export default MediaBox;
