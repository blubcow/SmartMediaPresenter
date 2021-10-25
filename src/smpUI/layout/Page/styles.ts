import { makeStyles, createStyles } from '@mui/styles';
import { Theme } from '@mui/material';

export default makeStyles((theme: Theme) =>
	createStyles({
		root: {
			minHeight: '100vh',
			height: '1px',
			backgroundColor: theme.palette.background.default,
		},
	})
);
