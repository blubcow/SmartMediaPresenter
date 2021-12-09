import React from 'react';
import { Drawer as MuiDrawer, DrawerProps } from '@mui/material';

export interface IDrawerProps extends DrawerProps {}

const Drawer: React.FC<IDrawerProps> = (props) => {
	return <MuiDrawer anchor='right' variant='temporary' {...props} />;
};

export default Drawer;
