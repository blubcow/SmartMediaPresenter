import React, { useState } from 'react';
import TopBar from '../smpUI/TopBar';
import { Box, IconButton } from '../smpUI/components';
import useThemedLogo from '../hooks/useThemedLogo';
import UserSettingsDrawer from './components/UserSettingsDrawer/UserSettingsDrawer';

import { createStyles, makeStyles } from '@mui/styles';
import { Theme } from '@mui/material';
import { Menu } from '@mui/icons-material';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		contaiener: {
			height: '100%',
			width: '100%',
			display: 'flex',
			justifyContent: 'space-between',
			alignItems: 'center',
		},
		logoContainer: {
			height: '55%',
		},
		img: {
			height: '100%',
		},
	})
);


const HomeTopBar: React.FC<{}> = () => {
	const { toolbarLogo } = useThemedLogo();
	const classes = useStyles();
	const [openUserSettings, setOpenUserSettings] = useState<boolean>(false);

	return (
		<TopBar>
			<Box className={classes.contaiener}>
				<Box className={classes.logoContainer}>
					<img className={classes.img} src={toolbarLogo} alt='SMP-Logo' />
				</Box>
				<Box>
					<IconButton icon={Menu} onClick={() => setOpenUserSettings(true)} />;
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
