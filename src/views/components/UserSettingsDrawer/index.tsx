import React from 'react';
import { Drawer, Box } from '../../../smpUI/components';
import { IDrawerProps } from '../../../smpUI/components/Drawer';
import ChangeLanguage from './ChangeLanguage';
import ChangeTheme from './ChangeTheme';
import { useUserSettingsDrawerStyles } from './styles';

interface IUserSettingsDrawerProps extends IDrawerProps {}

const UserSettingsDrawer: React.FC<IUserSettingsDrawerProps> = (props) => {
	const classes = useUserSettingsDrawerStyles();

	return (
		<Drawer {...props}>
			<Box className={classes.container}>
				<ChangeLanguage />
				<ChangeTheme />
			</Box>
		</Drawer>
	);
};

export default UserSettingsDrawer;
