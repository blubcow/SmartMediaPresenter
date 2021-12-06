import React, { useState, useEffect, useRef } from 'react';
import { Box } from '../../../smpUI/components';
import {
	Dimensions,
	MediaRessource,
	Slide,
} from '../../../shared/types/presentation';
import { IBoxProps } from '../../../smpUI/components/Box';
import MediaBox from '../MediaBox';
import PresentationFrame from '../PresentationFrame';
import useStyels from './styles';

export interface ISlideBoxProps extends IBoxProps {
	slide: Slide;
	didReceiveMediaFile?: (file: File, id: number) => void;
	mediaBoxesCanReceiveMedia?: boolean;
	activeMedia?: number;
	onActivateMedia?: (id: number) => void;
	onSelectedMediaBlur?: () => void;
	onSlideBackgroundClicked?: () => void;
	onSizeChanged?: (width: number, height: number) => void;
	presentationFrameEditingEnabled?: boolean;
	overflowEnabled?: boolean;
	dragToSwapEnabled?: boolean;
	onDragToSwapStarted?: (id: number) => void;
	onSwapped?: (id: number) => void;
}

const SlideEditingBox: React.FC<ISlideBoxProps> = (props) => {
	const {
		slide,
		didReceiveMediaFile,
		mediaBoxesCanReceiveMedia = false,
		activeMedia,
		onActivateMedia,
		onSelectedMediaBlur,
		onSlideBackgroundClicked,
		onSizeChanged,
		presentationFrameEditingEnabled,
		overflowEnabled = false,
		dragToSwapEnabled = false,
		onDragToSwapStarted,
		onSwapped,
	} = props;
	const [media, setMedia] = useState<MediaRessource[]>([...slide.media]);
	const [size, setSize] = useState<Dimensions>({ height: 0, width: 0 });
	const containerRef = useRef<any>();

	const passSizeUpdate = () => {
		const height = containerRef.current?.clientHeight ?? 0;
		const width = containerRef.current?.clientWidth ?? 0;

		if (onSizeChanged) onSizeChanged(width, height);
		setSize({ height: height, width: width });
	};
	const [sizeObserver] = useState<ResizeObserver>(
		new ResizeObserver(passSizeUpdate)
	);
	const classes = useStyels();

	useEffect(() => {
		if (containerRef.current === undefined) return;
		sizeObserver.observe(containerRef.current);

		return () => {
			// if (containerRef.current !== undefined)
			// sizeObserver.unobserve(containerRef.current);
		};
	}, [containerRef.current]);

	useEffect(() => {
		setMedia([...slide.media]);
	}, [slide]);

	return (
		<Box
			ref={containerRef}
			className={classes.container}
			sx={{
				bgcolor: slide.settings?.color ?? '#000',
				overflow: overflowEnabled ? 'visible' : 'hidden',
			}}
			onClick={onSlideBackgroundClicked}
		>
			{presentationFrameEditingEnabled !== undefined && (
				<PresentationFrame
					isEditing={presentationFrameEditingEnabled}
					isHidden={overflowEnabled && !presentationFrameEditingEnabled}
					parentSize={size}
					outlineColor={slide.settings?.color ?? '#000'}
					settings={slide.settings?.presentationFrame}
				/>
			)}
			<Box className={classes.mediaContainer}>
				{Array.apply(null, Array(slide.rows)).map((_, i) => (
					<Box
						key={i}
						className={classes.rowContainer}
						sx={{ maxHeight: `${100 / slide.rows}%` }}
					>
						{[...slide.media]
							.slice(i * slide.columns, i * slide.columns + slide.columns)
							.map((media, n) => (
								<MediaBox
									key={`${i}-${n}`}
									id={media.id}
									media={media}
									width={`${100 / slide.columns}%`}
									aspectRatio='16/9'
									didReceiveMediaFile={didReceiveMediaFile}
									canReceiveMedia={mediaBoxesCanReceiveMedia}
									isActive={
										activeMedia !== undefined && activeMedia! === media.id
									}
									onMediaSelectionBlur={onSelectedMediaBlur}
									activateMedia={(id: number) => {
										if (onActivateMedia) onActivateMedia(id);
									}}
									slideEditingBoxDimensions={size}
									draggable={dragToSwapEnabled}
									onDragStarted={onDragToSwapStarted}
									onDrop={onSwapped}
								/>
							))}
					</Box>
				))}
			</Box>
		</Box>
	);
};

export default SlideEditingBox;
