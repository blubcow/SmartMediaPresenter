import React from 'react';
import { Box, Paper } from '../../../smpUI/components';
import { LinearProgress } from '@mui/material';
import useStyles from './styles';
import useThemedLogo from '../../../hooks/useThemedLogo';

const LoadingIndicatorPaper: React.FC<{}> = () => {
	const classes = useStyles();
	const logos = useThemedLogo();

	return (
		<Paper>
			<Box className={classes.wrapper}>
				<Box className={classes.container}>
					<img src={logos.toolbarLogo} className={classes.img} alt='SMP-Logo' />
					<LinearProgress className={classes.indicator} />
				</Box>
			</Box>
		</Paper>
	);
};

export default LoadingIndicatorPaper;
