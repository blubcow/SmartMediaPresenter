import { createStyles, makeStyles } from '@mui/styles';
import { Theme } from '@mui/material';

export default makeStyles((theme: Theme) =>
	createStyles({
		container: {
			position: 'absolute',
			bottom: theme.spacing(3),
			right: theme.spacing(5),
			display: 'flex',
			flexDirection: 'row-reverse',
		},
	})
);
