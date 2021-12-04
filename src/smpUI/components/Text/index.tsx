import React, { useState, useEffect } from 'react';
import { Typography, TypographyProps } from '@mui/material';
import { EditText } from 'react-edit-text';
import useStyles from './styles';

export interface ITextProps extends TypographyProps {
	editable?: boolean;
	editableTextDidChange?: (
		prev: string,
		cur: string,
		setValue?: (value: string) => void
	) => void;
	minLength?: number;
	onInvalidInput?: () => void;
	parseInput?: (newValue: string) => string;
}

const Text: React.FC<ITextProps> = (props) => {
	const {
		editable = false,
		editableTextDidChange,
		minLength = 0,
		onInvalidInput,
		parseInput,
		placeholder,
	} = props;
	const [editableText, setEditableText] = useState<string>(
		`${props.children ?? ''}`
	);
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const classes = useStyles();

	useEffect(() => {
		setEditableText(`${props.children ?? ''}`);
	}, [props.children]);

	return (
		<Typography
			fontWeight='medium'
			{...props}
			sx={{ bgcolor: isEditing ? 'divider' : 'transparent' }}
		>
			{editable ? (
				<EditText
					placeholder={placeholder}
					className={classes.editableText}
					value={editableText}
					onChange={(value) => setEditableText(value)}
					// @ts-ignore
					onBlur={() => {
						setIsEditing(false);
					}}
					onEditMode={() => {
						setIsEditing(true);
					}}
					onSave={(value) => {
						if (editableTextDidChange)
							editableTextDidChange(value.previousValue, value.value);
						if (value.value.length < minLength) {
							setEditableText(value.previousValue);

							if (onInvalidInput) onInvalidInput();
						}
						if (parseInput) setEditableText(parseInput(value.value));
					}}
				/>
			) : (
				props.children
			)}
		</Typography>
	);
};

export default Text;
