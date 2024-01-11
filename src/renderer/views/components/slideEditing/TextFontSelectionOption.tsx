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
	const { font, ...liProps } = props;
	const classes = useTextFontSelectionOptionStyles();

	return (
		<li className={classes.container} {...liProps}>
			<Text fontFamily={font}>{font}</Text>
		</li>
	);
};

export default TextFontSelectionOption;
