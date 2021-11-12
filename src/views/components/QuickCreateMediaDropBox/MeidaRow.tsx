import React from 'react';
import { DataTransferIdentifiers } from '../../../shared/types/identifiers';
import { QuickCreateMediaResource } from '../../../shared/types/quickCreate';
import { Box, Text } from '../../../smpUI/components';
import { useMediaRowStyles } from './styles';

interface IMediaRowProps {
	media: QuickCreateMediaResource;
	id: number;
	onSelection: () => void;
	selected: boolean;
	onBlur: () => void;
}

const MediaRow: React.FC<IMediaRowProps> = (props) => {
	const { media, id, onSelection, selected, onBlur } = props;
	const classes = useMediaRowStyles();

	return (
		<Box
			className={classes.container}
			sx={{
				bgcolor: selected ? 'primary.main' : id % 2 ? 'transparent' : 'divider',
			}}
			onClick={onSelection}
			onBlur={onBlur}
			tabIndex={-1}
		>
			<Box
				className={classes.row}
				draggable
				onDragStart={(e) => {
					e.dataTransfer.setData(
						DataTransferIdentifiers.MediaFileInfo,
						JSON.stringify(media)
					);
				}}
			>
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
