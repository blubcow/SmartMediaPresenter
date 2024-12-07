import React from 'react';
import {
	Select,
	MenuItem,
	SelectProps,
	MenuItemProps,
	InputLabel,
	FormControl,
} from '@mui/material';

type SelectionFormControlProps = SelectProps & {
	label: string
}

export const SelectionFormControl: React.FC<SelectionFormControlProps> = (props) => {
	const { label } = props;

	return (
		<FormControl>
			{label && <InputLabel>{label}</InputLabel>}
			<Select {...props} />
		</FormControl>
	);
};