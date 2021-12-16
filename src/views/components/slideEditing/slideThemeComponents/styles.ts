import { makeStyles, createStyles } from '@mui/styles';
import { Theme } from '@mui/material';

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
