import React from 'react';
import { Box, Paper } from '../../smpUI/components';
import { LinearProgress } from '@mui/material';
import useThemedLogo from '../../hooks/useThemedLogo';
import { createStyles, makeStyles } from '@mui/styles';
import { Theme } from '@mui/material';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		wrapper: {
			width: '100%',
			height: '100%',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
		},
		container: {
			width: '100%',
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
		},
		img: {
			width: '45%',
			marginBottom: theme.spacing(3),
		},
		indicator: {
			maxWidth: '450px',
			width: '100%',
		},
	})
);


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
