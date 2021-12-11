import React from 'react';
import { Autocomplete } from '@mui/material';
import { TextField } from '../.';

interface IAutoCompleteSelectionProps {
	value?: string;
	onValueChanged: (value: string) => void;
	label: string;
	options: string[];
	style?: React.CSSProperties;
}

const AutoCompleteSelection: React.FC<IAutoCompleteSelectionProps> = (
	props
) => {
	const { value, onValueChanged, label, options, style } = props;
	return (
		<Autocomplete
			disablePortal
			disableClearable
			onChange={(_, val) => {
				if (onValueChanged) onValueChanged(val);
			}}
			value={value}
			style={style}
			options={options}
			renderInput={(params) => <TextField {...params} label={label} />}
		/>
	);
};

export default AutoCompleteSelection;
