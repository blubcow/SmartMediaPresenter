import { makeStyles, createStyles } from '@mui/styles';
import { Theme } from '@mui/material';

export default makeStyles((theme: Theme) =>
	createStyles({
		container: {
			height: '100%',
			width: '100%',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'space-between',
			alignItems: 'center',
		},
		topContainer: {
			height: '10%',
			display: 'flex',
			alignItems: 'center',
		},
		middleContainer: {},
		bottomContainer: {
			height: '10%',
			width: '100%',
			display: 'flex',
			alignItems: 'center',
		},
		slidesCounterContainer: {
			marginLeft: theme.spacing(1),
		},
	})
);
