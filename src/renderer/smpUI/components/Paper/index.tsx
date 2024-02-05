import React, { PropsWithChildren } from 'react';
import { Paper as MUIPaper } from '@mui/material';
import useStyles from './styles';

interface IPaperProps {}

const Paper: React.FC<PropsWithChildren<IPaperProps>> = (props) => {
	const classes = useStyles();

	return <MUIPaper className={classes.root} {...props} />;
};

export default Paper;
