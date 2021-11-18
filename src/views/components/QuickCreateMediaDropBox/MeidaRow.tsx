import React from 'react';
import { DataTransferIdentifiers } from '../../../shared/types/identifiers';
import { QuickCreateMediaResource } from '../../../shared/types/quickCreateMode';
import { Box, Text } from '../../../smpUI/components';
import { useMediaRowStyles } from './styles';

interface IMediaRowProps {
	media: QuickCreateMediaResource;
	id: number;
	onSelection: () => void;
	selected: boolean;
	onBlur: () => void;
	onDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
}

const MediaRow: React.FC<IMediaRowProps> = (props) => {
	const { media, id, onSelection, selected, onBlur, onDragStart } = props;
	const classes = useMediaRowStyles();

	return (
		<Box
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
				<Box className={classes.imgContainer}>
					<img
						className={classes.img}
						src={media.location.local ?? media.location.remote}
					/>
				</Box>
				<Box className={classes.txtContainer}>
					<Text>{media.name}</Text>
				</Box>
			</Box>
		</Box>
	);
};

export default MediaRow;
