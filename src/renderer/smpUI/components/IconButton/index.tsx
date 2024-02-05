import React from 'react';
import { IconButton as MUIIconButton, IconButtonProps } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';

export interface IIconButtonProps extends IconButtonProps {
	icon: SvgIconComponent;
}

const IconButton: React.FC<IIconButtonProps> = (props) => {
	const { icon: Icon, ...muiIconButtonProps } = props;

	return (
		<MUIIconButton sx={{ color: 'text.primary' }} size='large' {...muiIconButtonProps}>
			<Icon />
		</MUIIconButton>
	);
};

export default IconButton;
