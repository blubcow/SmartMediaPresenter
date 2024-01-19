import React from 'react';
import { Text } from '../../../smpUI/components';
import { useTextFontSelectionOptionStyles } from './styles';

interface ITextFontSelectionOptionProps
	extends React.HTMLAttributes<HTMLLIElement> {
	font: string;
}

const TextFontSelectionOption: React.FC<ITextFontSelectionOptionProps> = (
	props
) => {
	const { font } = props;
	const classes = useTextFontSelectionOptionStyles();

	return (
		<li className={classes.container} {...props}>
			<Text fontFamily={font}>{font}</Text>
		</li>
	);
};

export default TextFontSelectionOption;
