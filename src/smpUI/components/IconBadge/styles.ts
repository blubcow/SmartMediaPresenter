import { makeStyles, createStyles } from '@mui/styles';
import { Theme } from '@mui/material';

export default makeStyles((theme: Theme) =>
	createStyles({
		container: {
			padding: theme.spacing(2),
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			borderRadius: '50%',
			// this pseudo selection makes sure, that the container will alwais remain a square
			':after': {
				content: '""',
				display: 'block',
				paddingBottom: '100%',
			},
		},
	})
);
