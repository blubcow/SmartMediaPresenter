import { makeStyles, createStyles } from '@mui/styles';
import { Theme } from '@mui/material';

export const useChoosePlaybackTimeContentStyles = makeStyles((theme: Theme) =>
	createStyles({
		container: {
			padding: theme.spacing(2),
			width: '250px',
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			textAlign: 'center',
		},
		inputContainer: {
			display: 'flex',
			alignItems: 'end',
			paddingTop: theme.spacing(2),
			paddingBottom: theme.spacing(2),
		},
		inputLabelContainer: { minWidth: '80px' },
	})
);
