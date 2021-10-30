import { makeStyles, createStyles } from '@mui/styles';
import { Theme } from '@mui/material';

export default makeStyles((theme: Theme) =>
	createStyles({
		container: {
			width: '100%',
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			overflow: 'hidden',
		},
		img: {
			width: '50%',
			marginBottom: theme.spacing(3),
		},
	})
);
