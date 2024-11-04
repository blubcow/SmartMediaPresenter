import React, { PropsWithChildren } from 'react';
import { Paper as MUIPaper } from '@mui/material';
import { createStyles, makeStyles } from '@mui/styles';
import { Theme } from '@mui/material';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			padding: theme.spacing(3),
			backgroundColor: theme.palette.background.paper,
			minHeight: '150px',
			height: 'auto',
			width: '45%',
			maxWidth: '550px',
		},
	})
);


interface IPaperProps {}

const Paper: React.FC<PropsWithChildren<IPaperProps>> = (props) => {
	const classes = useStyles();

	return <MUIPaper className={classes.root} {...props} />;
};

export default Paper;
