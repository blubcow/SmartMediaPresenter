import React from 'react';
import { Autocomplete, AutocompleteRenderInputParams } from '@mui/material';

interface IAutoCompleteSelectionProps {
	value?: string;
	onValueChanged: (value: string) => void;
	options: string[];
	style?: React.CSSProperties;
	renderInput: (params: AutocompleteRenderInputParams) => React.ReactNode;
	renderOption?: (
		props: React.HTMLAttributes<HTMLLIElement>,
		option: string
	) => React.ReactNode;
}

const AutoCompleteSelection: React.FC<IAutoCompleteSelectionProps> = (
	props
) => {
	const { value, onValueChanged, options, style, renderOption, renderInput } =
		props;
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
			renderOption={renderOption}
			renderInput={renderInput}
		/>
	);
};

export default AutoCompleteSelection;
