import { makeStyles, createStyles } from '@mui/styles';
import { Theme } from '@mui/material';

export default makeStyles((theme: Theme) =>
	createStyles({
		container: {
			height: '100%',
			flex: 0.7,
			display: 'flex',
			alignItems: 'center',
			overflowY: 'scroll',
			flexDirection: 'column',
			justifyContent: 'start',
		},

		infoText: {
			flex: 1,
			width: '100%',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			textAlign: 'center',
		},
	})
);

export const useMediaRowStyles = makeStyles((theme: Theme) =>
	createStyles({
		container: {
			width: '100%',
			padding: theme.spacing(1),
			display: 'flex',
		},
		row: {
			maxHeight: '20px',
			cursor: 'pointer',
			display: 'flex',
		},
		imgContainer: {
			height: '100%',
			aspectRatio: '16/9',
			display: 'flex',
			justifyContent: 'center',
		},
		img: {
			height: '100%',
			maxWidth: '100%',
		},
		txtContainer: {
			marginLeft: theme.spacing(2),
		},
	})
);
