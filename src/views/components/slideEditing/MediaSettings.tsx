import React from 'react';
import {
	Dimensions,
	MediaRessource,
	MediaSettings as MediaSettingsType,
} from '../../../shared/types/presentation';
import { Box } from '../../../smpUI/components';
import CropButton from './CropButton';
import ImageManipulationButton from './ImageManipulationButton';
import MoveButton from './MoveButton';
import RemoveButton from './RemoveButton';
import RotateButton from './RotateButton';
import ScaleButton from './ScaleButton';
import { useSettingsContainerStyles } from './styles';

interface IMediaSettingsProps {
	media?: MediaRessource;
	onSettingsChanged: (settings: Partial<MediaSettingsType>) => void;
	slideMediaBoxDimensions: Dimensions;
}

const MediaSettings: React.FC<IMediaSettingsProps> = (props) => {
	const { media, onSettingsChanged, slideMediaBoxDimensions } = props;
	const classes = useSettingsContainerStyles();

	return (
		<Box className={classes.container}>
			<MoveButton
				selected={false}
				mediaResource={media}
				onMediaSettingsChanged={onSettingsChanged}
				slideEditingBoxDimensions={slideMediaBoxDimensions}
			/>
			<Box className={classes.spacer} />
			<ScaleButton
				mediaResource={media}
				onMediaSettingsChanged={onSettingsChanged}
				selected={false}
			/>
			<Box className={classes.spacer} />
			<RotateButton
				mediaResource={media}
				onMediaSettingsChanged={onSettingsChanged}
				selected={false}
			/>
			<Box className={classes.spacer} />
			<CropButton selected={false} />
			<Box className={classes.spacer} />
			<ImageManipulationButton
				selected={false}
				mediaResource={media}
				onMediaSettingsChanged={onSettingsChanged}
			/>
			<Box className={classes.spacer} />
			<RemoveButton />
		</Box>
	);
};

export default MediaSettings;
