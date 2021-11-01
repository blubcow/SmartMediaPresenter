import { makeStyles, createStyles } from '@mui/styles';
import { Theme } from '@mui/material';

export default makeStyles((theme: Theme) =>
	createStyles({
		container: {
			width: '100%',
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			overflow: 'hidden',
		},
		img: {
			width: '50%',
			marginBottom: theme.spacing(3),
		},
	})
);

export const useTextFieldContainerStyles = makeStyles((theme: Theme) =>
	createStyles({
		container: {
			width: '100%',
		},
		textFieldContainer: {
			width: '100%',
			marginTop: theme.spacing(3),
		},
	})
);

export const useAuthButtonContainerStyles = makeStyles((theme: Theme) =>
	createStyles({
		container: {
			width: '100%',
			display: 'flex',
			flexDirection: 'column',
		},
		buttonContainer: {
			marginTop: theme.spacing(2),
			display: 'flex',
			justifyContent: 'center',
		},
	})
);
