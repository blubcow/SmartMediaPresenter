import React from 'react';
import { Box } from '../../../smpUI/components';
import AddTextButton from './AddTextButton';
import ChangeBackgroundColorButton from './ChangeBackgroundColorButton';
import EditPresentationFrame from './EditPresentationFrame';
import EditThemeButton from './EditThemeButton';
import RemoveButton from './RemoveButton';
import TakeNotesButton from './TakeNotesButton';
import { useSettingsContainerStyles } from './styles';

interface ISlideSettingsProps {}

const SlideSettings: React.FC<ISlideSettingsProps> = () => {
	const classes = useSettingsContainerStyles();

	return (
		<Box className={classes.container}>
			<TakeNotesButton />
			<Box className={classes.spacer} />
			<EditPresentationFrame />
			<Box className={classes.spacer} />
			<AddTextButton selected={false} />
			<Box className={classes.spacer} />
			<ChangeBackgroundColorButton />
			<Box className={classes.spacer} />
			<EditThemeButton selected={false} />
			<Box className={classes.spacer} />
			<RemoveButton />
		</Box>
	);
};

export default SlideSettings;
