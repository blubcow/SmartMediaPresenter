import { createStyles, makeStyles } from '@mui/styles';
import { Theme } from '@mui/material';

export const useOptionRowStyles = makeStyles((theme: Theme) =>
	createStyles({
		rowContainer: {
			minHeight: '50px',
			width: '100%',
		},
		btnBase: { width: '100%' },
		optionRow: {
			height: '100%',
			width: '100%',
			padding: theme.spacing(2),
			display: 'flex',
			flexDirection: 'row',
			alignContent: 'center',
			justifyContent: 'flex-start',
			cursor: 'pointer',
			'&:hover': {
				backgroundColor: theme.palette.divider,
			},
		},
		optionRowIcon: {
			marginRight: theme.spacing(2),
		},
	})
);

export const useAudioPlaybackContentStyles = makeStyles((theme: Theme) =>
	createStyles({
		container: {
			padding: theme.spacing(2),
		},
		upperContainer: { display: 'flex', justifyContent: 'space-between' },
		removeBtnContainer: {
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
		},
		lowerContainer: {
			display: 'flex',
			justifyContent: 'center',
			paddingTop: theme.spacing(2),
		},
		lowerContent: {
			display: 'flex',
			alignItems: 'center',
		},
		playBtnContainer: {
			paddingRight: theme.spacing(1),
		},
		timerContainer: {
			display: 'flex',
			justifyContent: 'center',
			width: '60px',
		},
	})
);
