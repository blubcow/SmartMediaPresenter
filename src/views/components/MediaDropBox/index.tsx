import React, { useState } from 'react';
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
}

const MediaDropBox: React.FC<IMediaDropBox> = (props) => {
	const {
		id,
		didReceiveMediaFile,
		width,
		aspectRatio,
		canReceiveMedia = true,
		media,
	} = props;
	const classes = useStyles();

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
				height: '100%',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
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
					className={classes.img}
					src={media.location.local ?? media.location.remote}
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
							<Text>drop media here</Text>
							<Text variant='caption'>
								or click to choose from file inspector
							</Text>
						</Box>
					)}
				</Box>
			)}
		</Box>
	);
};

export default MediaDropBox;
