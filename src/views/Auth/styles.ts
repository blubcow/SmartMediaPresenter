import { makeStyles, createStyles } from '@mui/styles';
import { Theme } from '@mui/material';

export default makeStyles((theme: Theme) =>
	createStyles({
		container: {
			width: '100%',
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			justifyContent: 'center',
		},
		skipLoginButtonContainer: {
			width: '100%',
			display: 'flex',
			justifyContent: 'center',
			marginTop: theme.spacing(1),
		},
	})
);
