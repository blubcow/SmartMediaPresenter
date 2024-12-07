import { Menu } from '@mui/icons-material';
import { Box, IconButton, Theme } from '@mui/material';
import { createStyles, makeStyles } from '@mui/styles';
import React, { useState } from 'react';
import { useThemedLogo } from '../hooks';
import { TopBar } from '../smpUI';
import UserSettingsDrawer from './settings/UserSettingsDrawer';

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
					<IconButton onClick={() => setOpenUserSettings(true)} ><Menu/></IconButton>
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
