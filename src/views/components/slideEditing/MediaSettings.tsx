import React from 'react';
import { SlideSettings as SlideSettingsType } from '../../../shared/types/presentation';
import { Box } from '../../../smpUI/components';
import CropButton from './CropButton';
import ImageManipulationButton from './ImageManipulationButton';
import MoveButton from './MoveButton';
import RemoveButton from './RemoveButton';
import RotateButton from './RotateButton';
import ScaleButton from './ScaleButton';
import { useSettingsContainerStyles } from './styles';

interface IMediaSettingsProps {
	settings?: SlideSettingsType;
}

const MediaSettings: React.FC<IMediaSettingsProps> = (props) => {
	const { settings } = props;
	const classes = useSettingsContainerStyles();

	return (
		<Box className={classes.container}>
			<MoveButton selected={false} />
			<Box className={classes.spacer} />
			<ScaleButton selected={false} />
			<Box className={classes.spacer} />
			<RotateButton selected={false} />
			<Box className={classes.spacer} />
			<CropButton selected={false} />
			<Box className={classes.spacer} />
			<ImageManipulationButton selected={false} />
			<Box className={classes.spacer} />
			<RemoveButton />
		</Box>
	);
};

export default MediaSettings;
