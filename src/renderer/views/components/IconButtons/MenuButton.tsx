import React from 'react';
import { IconButton } from '../../../smpUI/components';
import { IconButtonProps } from '@mui/material';
import { Menu } from '@mui/icons-material';

const MenuButton: React.FC<IconButtonProps> = (props) => {
	return <IconButton icon={Menu} {...props} />;
};

export default MenuButton;
