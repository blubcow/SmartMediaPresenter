import React, { useRef, useState, useEffect } from 'react';
import useRemoteUserContext from '../../../hooks/useRemoteUserContext';
import {
	Dimensions,
	MediaAlignment,
	MediaRessource,
} from '../../../shared/types/presentation';
import { Box } from '../../../smpUI/components';
import MediaDropBoxIndicator from '../MediaDropBoxIndicator';
import ActiveMediaIdenticator from './ActiveMediaIdenticator';
import ColorChannelFilter from './ColorChannelFilter';
import useStyles from './styles';
import { useLocalFileSystem } from '../../../hooks/useMainProcessMethods';
import LocalOrRemoteModal from '../modals/LocalOrRemoteModal';
import RemoteFileExplorer from '../RemoteFileExplorer';

interface IMediaBox {
	id: number;
	width: string;
	aspectRatio: string;
	canReceiveMedia?: boolean;
	media?: MediaRessource;
	themeAlignment?: MediaAlignment;
	isActive?: boolean;
	activateMedia?: (id: number) => void;
	onMediaSelectionBlur?: () => void;
	didReceiveMediaFile?: (file: File, id: number) => void;
	didReceiveRemoteMediaUrl?: (url: string, id: number) => void;
	slideEditingBoxDimensions?: Dimensions;
	draggable: boolean;
	onDragStarted?: (id: number) => void;
	onDrop?: (id: number) => void;
}

const MediaBox: React.FC<IMediaBox> = (props) => {
	const {
		id,
		didReceiveMediaFile,
		didReceiveRemoteMediaUrl,
		width,
		aspectRatio,
		canReceiveMedia = true,
		media,
		themeAlignment,
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
	const [imgSrc, setImgSrc] = useState<string | undefined>(
		media?.location?.local ?? media?.location?.remote
	);
	const { userLoggedIn } = useRemoteUserContext();
	const { openFileSelectorDialog } = useLocalFileSystem();
	const [openLocalOrRemoteSelector, setOpenLocalOrRemoteSelector] =
		useState<boolean>(false);
	const [openRemoteFileExplorer, setOpenRemoteFileExplorer] =
		useState<boolean>(false);

	const alignment = media?.settings?.alignment ?? themeAlignment;

	const handleLocalFileSelection = () => {
		openFileSelectorDialog('media').then((file: any[]) => {
			if (didReceiveMediaFile && canReceiveMedia && file.length > 0) {
				didReceiveMediaFile(
					{
						name: file[0].name,
						// @ts-ignore
						path: file[0].location.local.substring(7),
					},
					id
				);
			}
		});
	};

	useEffect(() => {
		setImgSrc(media?.location?.local ?? media?.location?.remote);
	}, [media]);

	return (
		<Box
			sx={{
				maxWidth: width,
				maxHeight: '100%',
				aspectRatio:
					media?.location?.local || media?.location?.remote
						? undefined
						: aspectRatio,
				padding: media?.location?.local || media?.location?.remote ? 0 : 0.5,
				cursor: 'pointer',
				height:
					media?.location?.local || media?.location?.remote
						? '100%'
						: undefined,
				width:
					(media?.location?.local || media?.location?.remote) &&
					(!alignment || alignment === 'auto')
						? undefined
						: width,
				display: 'flex',
				flexDirection: 'column',
				alignItems:
					alignment && alignment! !== 'auto'
						? alignment === 'left'
							? 'start'
							: alignment === 'center'
							? 'center'
							: 'end'
						: undefined,
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
			{isActive && media && (
				<ActiveMediaIdenticator image={imgRef.current} mediaElement={media} />
			)}
			{media?.location?.local || media?.location?.remote ? (
				<>
					<ColorChannelFilter
						id={id}
						channels={
							media.settings?.rgbChannels ?? {
								red: { r: 1, g: 0, b: 0, alpha: 0 },
								green: { r: 0, g: 1, b: 0, alpha: 0 },
								blue: { r: 0, g: 0, b: 1, alpha: 0 },
							}
						}
					/>
					<img
						ref={imgRef}
						className={classes.img}
						src={imgSrc}
						loading='lazy'
						placeholder='/resources/icon.png'
						onError={() => {
							if (
								media.location.local &&
								media.location.remote &&
								imgSrc !== media.location.remote
							)
								setImgSrc(media.location.remote);
						}}
						draggable={false}
						onClick={(e) => {
							e.stopPropagation();
							if (activateMedia) activateMedia(id);
						}}
						onBlur={(e) => {
							if (e.relatedTarget?.id === 'mediaOrSlideEditing') {
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
							}px) url(#${media.id})`,
							clipPath: `inset(${media.settings?.crop?.y ?? 0}% ${
								100 -
								((media.settings?.crop?.x ?? 0) +
									(media.settings?.crop?.width ?? 100))
							}% ${
								100 -
								((media.settings?.crop?.y ?? 0) +
									(media.settings?.crop?.height ?? 100))
							}% ${media.settings?.crop?.x ?? 0}%)`,
						}}
						alt='presentation-media'
					/>
				</>
			) : canReceiveMedia ? (
				<>
					<MediaDropBoxIndicator
						canTapToOpenFileInspector
						sx={{ bgcolor: 'divider' }}
						onClick={() => {
							if (userLoggedIn) {
								setOpenLocalOrRemoteSelector(true);
							} else {
								handleLocalFileSelection();
							}
						}}
					/>
					<LocalOrRemoteModal
						open={openLocalOrRemoteSelector}
						onSelection={(selection) => {
							if (selection === 'local') handleLocalFileSelection();
							if (selection === 'remote') setOpenRemoteFileExplorer(true);
							setOpenLocalOrRemoteSelector(false);
						}}
						onClose={() => setOpenLocalOrRemoteSelector(false)}
					/>
					{openRemoteFileExplorer && (
						<RemoteFileExplorer
							open={true}
							onClose={() => setOpenRemoteFileExplorer(false)}
							filterItems='image'
							onMediaChoosen={(url) => {
								if (didReceiveRemoteMediaUrl) didReceiveRemoteMediaUrl(url, id);
								setOpenRemoteFileExplorer(false);
							}}
						/>
					)}
				</>
			) : (
				<Box sx={{ height: '100%', width: '100%', bgcolor: 'divider' }} />
			)}
		</Box>
	);
};

export default MediaBox;
