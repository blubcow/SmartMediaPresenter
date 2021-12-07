import React from 'react';
import usePresentationEditingContext from '../../../hooks/usePresentationEditingContext';
import { Box } from '../../../smpUI/components';
import CropButton from './CropButton';
import ImageManipulationButton from './ImageManipulationButton';
import MoveButton from './MoveButton';
import RemoveMediaButton from './RemoveMediaButton';
import RotateButton from './RotateButton';
import ScaleButton from './ScaleButton';
import { useSettingsContainerStyles } from './styles';

interface IMediaSettingsProps {}

const MediaSettings: React.FC<IMediaSettingsProps> = (props) => {
	const { state } = usePresentationEditingContext();
	const classes = useSettingsContainerStyles();

	return (
		<Box className={classes.container}>
			<MoveButton />
			<Box className={classes.spacer} />
			<ScaleButton />
			<Box className={classes.spacer} />
			<RotateButton />
			<Box className={classes.spacer} />
			<CropButton selected={false} />
			<Box className={classes.spacer} />
			<ImageManipulationButton />
			<Box className={classes.spacer} />
			<RemoveMediaButton />
		</Box>
	);
};

export default MediaSettings;
