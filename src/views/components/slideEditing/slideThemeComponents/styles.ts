import { makeStyles, createStyles } from '@mui/styles';
import { Theme } from '@mui/material';

export const useRowStyles = makeStyles((theme: Theme) =>
	createStyles({
		container: {
			padding: theme.spacing(1),
			height: '100px',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
		},
		content: {
			height: '100%',
			width: '100%',
			padding: theme.spacing(2),
			display: 'flex',
			justifyContent: 'space-between',
			alignItems: 'center',
			borderRadius: theme.shape.borderRadius,
			boxShadow: theme.shadows[10],
		},
		txt: {
			pointerEvents: 'none',
		},
	})
);

export const useDefaultFormatStyles = makeStyles((theme: Theme) =>
	createStyles({
		nodeContainer: {
			display: 'flex',
			width: '250px',
			justifyContent: 'space-around',
		},
		inputContainer: {
			width: '100px',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
		},
	})
);

export const useDefaultPlaybackTimeStyles = makeStyles((theme: Theme) =>
	createStyles({
		nodeContainer: {
			display: 'flex',
			width: '95px',
			justifyContent: 'flex-end',
		},
	})
);

export const useDefaultFontSizeStyles = makeStyles((theme: Theme) =>
	createStyles({
		nodeContainer: {
			width: '120px',
			display: 'flex',
			justifyContent: 'flex-end',
		},
	})
);
