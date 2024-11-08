import React from 'react';
import {
	Select,
	MenuItem,
	SelectProps,
	MenuItemProps,
	InputLabel,
	FormControl,
} from '@mui/material';

type ISelectionPickerProps = SelectProps & {
	label: string
}

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
