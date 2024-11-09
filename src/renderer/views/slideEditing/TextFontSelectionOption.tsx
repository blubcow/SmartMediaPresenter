import React from 'react';
import EditableText from '../../smpUI/EditableText';
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
			<EditableText fontFamily={font}>{font}</EditableText>
		</li>
	);
};

export default TextFontSelectionOption;
