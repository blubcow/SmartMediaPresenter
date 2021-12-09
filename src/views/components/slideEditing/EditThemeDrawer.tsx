import React from 'react';
import { Drawer } from '../../../smpUI/components';
import { IDrawerProps } from '../../../smpUI/components/Drawer';
import { useEditThemeDrawerStyles } from './styles';

const EditThemeDrawer: React.FC<IDrawerProps> = (props) => {
	const classes = useEditThemeDrawerStyles();

	return (
		<Drawer className={classes.container} {...props}>
			edit theme
		</Drawer>
	);
};

export default EditThemeDrawer;
