import React, { useState } from 'react';
import { Typography, TypographyProps } from '@mui/material';
import { EditText } from 'react-edit-text';
import useStyles from './styles';

interface ITextProps extends TypographyProps {
	editable?: boolean;
	editableTextDidChange?: (prev: string, cur: string) => void;
	minLength?: number;
	onInvalidInput?: () => void;
}

const Text: React.FC<ITextProps> = (props) => {
	const {
		editable = false,
		editableTextDidChange,
		minLength = 0,
		onInvalidInput,
	} = props;
	const [editableText, setEditableText] = useState<string>(
		`${props.children ?? ''}`
	);
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const classes = useStyles();

	return (
		<Typography
			fontWeight='medium'
			{...props}
			sx={{ bgcolor: isEditing ? 'divider' : 'transparent' }}
		>
			{editable ? (
				<EditText
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
					}}
				/>
			) : (
				props.children
			)}
		</Typography>
	);
};

export default Text;
