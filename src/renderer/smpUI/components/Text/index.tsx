import React, { useState, useEffect, useRef } from 'react';
import { Typography, TypographyProps } from '@mui/material';
import { EditText, EditTextarea } from 'react-edit-text';
import useStyles from './styles';
import _ from 'lodash';

export interface ITextProps extends TypographyProps {
	editable?: boolean | string;
	multiLineEditable?: boolean;
	editableTextDidChange?: (
		prev: string,
		cur: string,
		setValue?: (value: string) => void
	) => void;
	minLength?: number;
	onInvalidInput?: () => void;
	parseInput?: (newValue: string) => string;

	// TODO: This is not available in the MUI type "TypographyProps" after update - what is the new one?
	placeholder?: string;
}

const Text: React.FC<ITextProps> = (props) => {
	const {
		editable = false,
		multiLineEditable = false,
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
	const textareaRef = useRef<any>();

	const typographyProps = _.omit(props, ['editable', 'multiLineEditable', 'editableTextDidChange', 'minLength', 'onInvalidInput', 'parseInput', 'placeholder']);

	useEffect(() => {
		setEditableText(`${props.children ?? ''}`);
	}, [props.children]);

	return (
		<Typography
			fontWeight='medium'
			component={'span'}
			{...typographyProps}
			sx={{
				bgcolor: isEditing && !multiLineEditable ? 'divider' : 'transparent',
			}}
		>
			{editable ? (
				multiLineEditable ? (
					<EditTextarea
						placeholder={placeholder}
						// className={classes.editableText}
						value={editableText}
						style={{ display: 'block', resize: 'none' }}
						onChange={(e) => {
							if (parseInput) setEditableText(parseInput(e.target.value));
							else setEditableText(e.target.value);
						}}
						onBlur={() => {
							setIsEditing(false);
						}}
						onEditMode={() => {
							setIsEditing(true);
						}}
						onSave={({ name, value, previousValue }) => {
							if (value.length < minLength) {
								setEditableText(previousValue);
								return;
							}

							if (editableTextDidChange)
								editableTextDidChange(previousValue, editableText);
						}}
					/>
				) : (
					<EditText
						placeholder={placeholder}
						className={classes.editableText}
						value={editableText}
						onChange={(e) => {
							if (parseInput) setEditableText(parseInput(e.target.value));
							else setEditableText(e.target.value);
						}}
						onBlur={() => {
							setIsEditing(false);
						}}
						onEditMode={() => {
							setIsEditing(true);
						}}
						onSave={({ name, value, previousValue }) => {
							if (value.length < minLength) {
								setEditableText(previousValue);
								return;
							}

							if (editableTextDidChange)
								editableTextDidChange(previousValue, editableText);
						}}
					/>
				)
			) : (
				props.children
			)}
		</Typography>
	);
};

export default Text;
