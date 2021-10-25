import React from 'react';
import Paper from '../../../smpUI/components/Paper';
import Box from '../../../smpUI/components/Box';
import { LinearProgress } from '@mui/material';
import useStyles from './styles';

const LoadingIndicatorPaper: React.FC<{}> = () => {
	const classes = useStyles();

	return (
		<Paper>
			<Box className={classes.wrapper}>
				<Box className={classes.container}>
					<img src='/resources/toolbar-logo-dark.png' className={classes.img} />
					<LinearProgress className={classes.indicator} />
				</Box>
			</Box>
		</Paper>
	);
};

export default LoadingIndicatorPaper;
