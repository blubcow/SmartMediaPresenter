import React, { useRef } from 'react';
import { Dimensions, MediaRessource } from '../../../shared/types/presentation';
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
	slideEditingBoxDimensions?: Dimensions;
	draggable: boolean;
	onDragStarted?: (id: number) => void;
	onDrop?: (id: number) => void;
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
		slideEditingBoxDimensions,
		draggable,
		onDragStarted,
		onDrop,
	} = props;
	const classes = useStyles();
	const imgRef = useRef<any>();

	return (
		<Box
			sx={{
				maxWidth: width,
				maxHeight: '100%',
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
				if (didReceiveMediaFile && canReceiveMedia && e.dataTransfer.files[0])
					didReceiveMediaFile(e.dataTransfer.files[0], id);
				else if (onDrop) onDrop(id);
			}}
			draggable={draggable}
			onDragStart={(e) => {
				if (onDragStarted) {
					e.dataTransfer.setDragImage(
						imgRef.current,
						imgRef.current.offsetWidth / 2,
						imgRef.current.offsetHeight / 2
					);
					onDragStarted(id);
				}
			}}
		>
			{media?.location.local || media?.location.remote ? (
				<img
					ref={imgRef}
					className={isActive ? classes.imgSelected : classes.img}
					src={media.location.local ?? media.location.remote}
					draggable={false}
					onClick={(e) => {
						e.stopPropagation();
						if (activateMedia) activateMedia(id);
					}}
					onBlur={(e) => {
						// TODO: take focus if the condition matches
						if (e.relatedTarget?.id === 'mediaOrSlideEditing') {
							// e.target.focus();
							return;
						}
						if (onMediaSelectionBlur) onMediaSelectionBlur();
					}}
					tabIndex={id}
					style={{
						transform: `translate(${
							((slideEditingBoxDimensions?.width ?? 0) /
								(media?.settings?.translation?.rel?.width ?? 1)) *
							(media?.settings?.translation?.x ?? 0)
						}px, ${
							((slideEditingBoxDimensions?.height ?? 0) /
								(media?.settings?.translation?.rel?.height ?? 1)) *
							(media?.settings?.translation?.y ?? 0)
						}px) scale(${media?.settings?.scaling?.x ?? 1}, ${
							media?.settings?.scaling?.y ?? 1
						}) rotate(${media.settings?.rotation ?? 0}deg)`,
						filter: `brightness(${
							media.settings?.brightness ?? 100
						}%) contrast(${media.settings?.contrast ?? 100}%) saturate(${
							media.settings?.saturation ?? 100
						}%) grayscale(${media.settings?.grayScale ?? 0}%) sepia(${
							media.settings?.sepia ?? 0
						}%) hue-rotate(${media.settings?.hue ?? 0}deg) blur(${
							media.settings?.blur ?? 0
						}px)`,
					}}
					alt='presentation-media'
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
