import React, { useState } from 'react';
import { MediaRessource } from '../../../shared/types/presentation';
import { Box, Text } from '../../../smpUI/components';
import useStyles from './styles';

interface IMediaDropBox {
	id: number;
	didReceiveMediaFile: (file: File, id: number) => void;
	width: string;
	aspectRatio: string;
	media?: MediaRessource;
}

const MediaDropBox: React.FC<IMediaDropBox> = (props) => {
	const { id, didReceiveMediaFile, width, aspectRatio, media } = props;
	const classes = useStyles();

	return (
		<Box
			sx={{
				width: width,
				aspectRatio: aspectRatio,
				bgcolor: 'divider',
				padding: media?.location.local || media?.location.remote ? 0 : 1,
				margin: media?.location.local || media?.location.remote ? 0 : 0.5,
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
				didReceiveMediaFile(e.dataTransfer.files[0], id);
			}}
		>
			{media?.location.local || media?.location.remote ? (
				<img
					className={classes.img}
					src={media.location.local ?? media.location.remote}
				/>
			) : (
				<Box className={classes.droppingArea}>
					<Text>drop media here</Text>
					<Text variant='caption'>or click to choose from file inspector</Text>
				</Box>
			)}
		</Box>
	);
};

export default MediaDropBox;
