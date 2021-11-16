import React from 'react';
import { Box } from '../../../smpUI/components';
import AddTextButton from './AddTextButton';
import ChangeBackgroundColorButton from './ChangeBackgroundColorButton';
import EditThemeButton from './EditThemeButton';
import RemoveButton from './RemoveButton';
import { useSlideSettingsStyles } from './styles';

const SlideSettings: React.FC<{}> = () => {
	const classes = useSlideSettingsStyles();

	return (
		<Box className={classes.container}>
			<AddTextButton selected={false} />
			<Box className={classes.spacer} />
			<ChangeBackgroundColorButton backgroundColor='#000' selected={false} />
			<Box className={classes.spacer} />
			<EditThemeButton selected={false} />
			<Box className={classes.spacer} />
			<RemoveButton />
		</Box>
	);
};

export default SlideSettings;
