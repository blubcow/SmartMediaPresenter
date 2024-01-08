import { createStyles, makeStyles } from '@mui/styles';
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
