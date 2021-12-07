import React from 'react';
import { Box } from '../../../smpUI/components';
import AddTextButton from './AddTextButton';
import ChangeBackgroundColorButton from './ChangeBackgroundColorButton';
import EditPresentationFrame from './EditPresentationFrame';
import EditThemeButton from './EditThemeButton';
import RemoveSlideButton from './RemoveSlideButton';
import TakeNotesButton from './TakeNotesButton';
import { useSettingsContainerStyles } from './styles';
import SlideFormatButton from './SlideFormatButton';
import AudioButton from './AudioButton';
import AutoPlaybackButton from './AutoPlaybackButton';

interface ISlideSettingsProps {}

const SlideSettings: React.FC<ISlideSettingsProps> = () => {
	const classes = useSettingsContainerStyles();

	return (
		<Box className={classes.container}>
			<AutoPlaybackButton />
			<Box className={classes.spacer} />
			<AudioButton />
			<Box className={classes.spacer} />
			<TakeNotesButton />
			<Box className={classes.spacer} />
			<EditPresentationFrame />
			<Box className={classes.spacer} />
			<AddTextButton selected={false} />
			<Box className={classes.spacer} />
			<SlideFormatButton />
			<Box className={classes.spacer} />
			<ChangeBackgroundColorButton />
			<Box className={classes.spacer} />
			<EditThemeButton selected={false} />
			<Box className={classes.spacer} />
			<RemoveSlideButton />
		</Box>
	);
};

export default SlideSettings;
