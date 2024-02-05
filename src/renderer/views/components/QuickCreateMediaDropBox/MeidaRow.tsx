import React, { useRef } from 'react';
import { QuickCreateMediaResource } from '../../../types/quickCreateMode';
import { Box, Text } from '../../../smpUI/components';
import { useMediaRowStyles } from './styles';
import { LazyLoadImage } from 'react-lazy-load-image-component';

interface IMediaRowProps {
	media: QuickCreateMediaResource;
	id: number;
	onSelection: () => void;
	selected: boolean;
	onBlur: () => void;
	onDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
	previewEnabled: boolean;
}

const MediaRow: React.FC<IMediaRowProps> = (props) => {
	const {
		media,
		id,
		onSelection,
		selected,
		onBlur,
		onDragStart,
		previewEnabled,
	} = props;
	const classes = useMediaRowStyles();
	const scrollingContainerRef = useRef();

	return (
		<Box
			ref={scrollingContainerRef}
			className={selected ? classes.selected : classes.container}
			sx={{
				bgcolor: selected ? 'primary.main' : id % 2 ? 'transparent' : 'divider',
			}}
			onClick={onSelection}
			onBlur={(e) => {
				if (e.relatedTarget?.className.split(' ')[0] !== classes.selected)
					onBlur();
			}}
			tabIndex={-1}
			draggable={selected}
			onDragStart={onDragStart}
		>
			<Box className={classes.row} draggable onDragStart={onDragStart}>
				{previewEnabled && (
					<Box className={classes.imgContainer}>
						<LazyLoadImage
							className={classes.img}
							src={media.location.local ?? media.location.remote}
							alt='media'
							effect='blur'
						/>
					</Box>
				)}

				<Box className={classes.txtContainer}>
					<Text>{media.name}</Text>
				</Box>
			</Box>
		</Box>
	);
};

export default MediaRow;
