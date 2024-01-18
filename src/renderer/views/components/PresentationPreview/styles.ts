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
			position: 'relative',
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
		btns: {
			display: 'flex',
			gap: theme.spacing(3),
			padding: theme.spacing(3),
		},
		btn: {
			padding: theme.spacing(1),
			width: '100%',
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			justifyContent: 'center',
			gap: theme.spacing(1),
			textAlign: 'center',
			borderRadius: theme.shape.borderRadius,
			transition: 'box-shadow 0.2s ease',
			boxShadow: theme.shadows[5],
			cursor: 'pointer',
			'&:hover': {
				boxShadow: theme.shadows[20],
			},
		},
	})
);
