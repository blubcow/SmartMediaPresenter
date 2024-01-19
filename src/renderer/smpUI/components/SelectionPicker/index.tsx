import React from 'react';
import {
	Select,
	MenuItem,
	SelectProps,
	MenuItemProps,
	InputLabel,
	FormControl,
} from '@mui/material';

interface ISelectionPickerProps extends SelectProps {}

const SelectionPicker: React.FC<ISelectionPickerProps> = (props) => {
	const { label } = props;

	return (
		<FormControl>
			{label && <InputLabel>{label}</InputLabel>}
			<Select {...props} />
		</FormControl>
	);
};

interface ISelectionPickerOptionProps extends MenuItemProps {}

export const SelectionPickerOption: React.FC<ISelectionPickerOptionProps> = (
	props
) => {
	return <MenuItem {...props} />;
};

export default SelectionPicker;
