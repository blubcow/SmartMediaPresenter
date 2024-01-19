import { createStyles, makeStyles, Theme } from '@mui/material';

export default makeStyles((theme: Theme) =>
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
