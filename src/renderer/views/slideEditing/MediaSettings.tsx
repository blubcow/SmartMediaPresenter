import React, { useContext } from 'react';
import { Box } from '../../../smpUI/components';
import AlignMediaButton from './AlignMediaButton';
import CropButton from './CropButton';
import ImageManipulationButton from './ImageManipulationButton';
import MoveButton from './MoveButton';
import RemoveMediaButton from './RemoveMediaButton';
import RotateButton from './RotateButton';
import ScaleButton from './ScaleButton';
import { useSettingsContainerStyles } from './styles';
import ColorTransferButton from './ColorTransferButton';
import { MediaSettingsProvider, useMediaSettingsContext } from '../../../providers/MediaSettingsProvider';
import AutoAlignmentButton from './AutoAlignmentButton';

interface IMediaSettingsProps { }

const MediaSettings: React.FC<IMediaSettingsProps> = (props) => {
	const classes = useSettingsContainerStyles();
	const { ref } = useMediaSettingsContext();

	return (
		<Box className={classes.container} ref={ref}>
			<AutoAlignmentButton />
			<Box className={classes.spacer} />
			<ColorTransferButton />
			<Box className={classes.spacer} />
			<AlignMediaButton />
			<Box className={classes.spacer} />
			<MoveButton />
			<Box className={classes.spacer} />
			<ScaleButton />
			<Box className={classes.spacer} />
			<RotateButton />
			<Box className={classes.spacer} />
			<CropButton />
			<Box className={classes.spacer} />
			<ImageManipulationButton />
			<Box className={classes.spacer} />
			<RemoveMediaButton />
		</Box>
	);
};

export default MediaSettings;
