import React from 'react';
import { IconButton as MUIIconButton, IconButtonProps } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';

interface IIconButtonProps extends IconButtonProps {
	icon: SvgIconComponent;
}

const IconButton: React.FC<IIconButtonProps> = (props) => {
	const { icon } = props;

	return <MUIIconButton {...props}>{icon}</MUIIconButton>;
};

export default IconButton;
