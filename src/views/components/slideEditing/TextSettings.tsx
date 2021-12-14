import React from 'react';
import { Box } from '../../../smpUI/components';
import ChangeTextColorButton from './ChangeTextColorButton';
import RemoveTextButton from './RemoveTextButton';
import { useSettingsContainerStyles } from './styles';
import TextFontSelection from './TextFontSelection';
import TextOptionsContainer from './TextOptionsContainer';

interface ITextSettingsProps {}

const TextSettings: React.FC<ITextSettingsProps> = () => {
	const classes = useSettingsContainerStyles();

	return (
		<Box className={classes.container}>
			<TextFontSelection />
			<Box className={classes.spacer} />
			<TextOptionsContainer />
			<Box className={classes.spacer} />
			<ChangeTextColorButton />
			<Box className={classes.spacer} />
			<RemoveTextButton />
		</Box>
	);
};

export default TextSettings;
