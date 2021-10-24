import { makeStyles, createStyles } from '@mui/styles';
import { Theme } from '@mui/material';

export default makeStyles((theme: Theme) =>
	createStyles({
		root: {
			backgroundColor: theme.palette.background.default,
		},
	})
);
