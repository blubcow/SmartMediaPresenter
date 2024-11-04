import React from 'react';
import { Popover as MuiPopover, PopoverProps } from '@mui/material';

export interface IPopoverProps extends PopoverProps {}

const Popover: React.FC<IPopoverProps> = (props) => {
	return (
		<MuiPopover
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'center',
			}}
			transformOrigin={{
				vertical: 'top',
				horizontal: 'center',
			}}
			{...props}
		/>
	);
};

export default Popover;
