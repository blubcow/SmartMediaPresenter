import { createStyles, makeStyles, Theme } from '@mui/material';

export default makeStyles((theme: Theme) =>
	createStyles({
		container: {
			minWidth: '180px',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
		},
		iconTimerContainer: {
			padding: theme.spacing(2),
			display: 'flex',
			justifyContent: 'space-between',
			alignItems: 'center',
		},
	})
);
