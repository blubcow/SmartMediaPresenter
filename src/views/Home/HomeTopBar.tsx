import React, { useState } from 'react';
import { TopBar } from '../../smpUI/layout';
import { Box } from '../../smpUI/components';
import { MenuButton } from '../components/IconButtons';
import useThemedLogo from '../../hooks/useThemedLogo';
import { useTopBarStyles } from './styles';
import UserSettingsDrawer from '../components/UserSettingsDrawer';

const HomeTopBar: React.FC<{}> = () => {
	const { toolbarLogo } = useThemedLogo();
	const classes = useTopBarStyles();
	const [openUserSettings, setOpenUserSettings] = useState<boolean>(false);

	return (
		<TopBar>
			<Box className={classes.contaiener}>
				<Box className={classes.logoContainer}>
					<img className={classes.img} src={toolbarLogo} alt='SMP-Logo' />
				</Box>
				<Box>
					<MenuButton onClick={() => setOpenUserSettings(true)} />
				</Box>
			</Box>
			<UserSettingsDrawer
				open={openUserSettings}
				onClose={() => setOpenUserSettings(false)}
			/>
		</TopBar>
	);
};

export default HomeTopBar;
