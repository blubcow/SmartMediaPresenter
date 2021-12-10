import React from 'react';
import { Box } from '../../../smpUI/components';
import RemoveTextButton from './RemoveTextButton';
import { useSettingsContainerStyles } from './styles';
import TextAliginmentButton from './TextAlignmentButton';
import TextStyleButton from './TextStyleButton';

interface ITextSettingsProps {}

const TextSettings: React.FC<ITextSettingsProps> = () => {
	const classes = useSettingsContainerStyles();

	return (
		<Box className={classes.container}>
			<TextStyleButton />
			<Box className={classes.spacer} />
			<TextAliginmentButton />
			<Box className={classes.spacer} />
			<RemoveTextButton />
		</Box>
	);
};

export default TextSettings;
