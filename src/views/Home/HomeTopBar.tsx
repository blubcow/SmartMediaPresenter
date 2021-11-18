import React from 'react';
import { TopBar } from '../../smpUI/layout';
import { Box } from '../../smpUI/components';
import { MenuButton } from '../components/IconButtons';
import useThemedLogo from '../../hooks/useThemedLogo';
import { useTopBarStyles } from './styles';

const HomeTopBar: React.FC<{}> = () => {
	const { toolbarLogo } = useThemedLogo();
	const classes = useTopBarStyles();

	return (
		<TopBar>
			<Box className={classes.contaiener}>
				<Box className={classes.logoContainer}>
					<img className={classes.img} src={toolbarLogo} alt='SMP-Logo' />
				</Box>
				<Box>
					<MenuButton />
				</Box>
			</Box>
		</TopBar>
	);
};

export default HomeTopBar;
