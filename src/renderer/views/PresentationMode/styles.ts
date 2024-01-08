import { createStyles, makeStyles } from '@mui/styles';
import { Theme } from '@mui/material';

export default makeStyles((theme: Theme) =>
	createStyles({
		container: {
			height: '100vh',
			width: '100vw',
			display: 'flex',
			flexDirection: 'column',
			backgroundColor: theme.palette.background.default,
		},
		upperBox: {
			flex: 0.55,
			width: '100%',
			display: 'flex',
		},
		upperLeftBox: {
			flex: 0.6,
			padding: theme.spacing(2),
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'space-between',
			position: 'relative',
		},
		controlsContainer: {
			display: 'flex',
			justifyContent: 'space-evenly',
		},
		slideCounterContainer: {
			height: '100%',
			display: 'flex',
			alignItems: 'center',
		},
		upperRightBox: {
			flex: 0.4,
			height: '100%',
			display: 'flex',
			justifyContent: 'center',
			flexDirection: 'column',
			alignItems: 'center',
		},
		timerContainer: {
			display: 'flex',
			flexDirection: 'column',
			height: '65px',
			justifyContent: 'space-between',
			alignItems: 'center',
		},
		lowerBox: {
			flex: 0.45,
			width: '100%',
			padding: theme.spacing(2),
			display: 'flex',
			flexDirection: 'column',
			whiteSpace: 'pre',
			wordBreak: 'keep-all',
			overflow: 'scroll',
		},
		notesContainer: {
			flex: 1,
			width: '100%',
			overflow: 'hidden',
			padding: theme.spacing(1),
		},
		notes: {
			height: '100%',
			width: '100%',
			whiteSpace: 'pre-line',
			wordBreak: 'break-all',
			overflowY: 'scroll',
		},
		spacer: {
			height: theme.spacing(2),
		},
	})
);
