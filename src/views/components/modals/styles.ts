import { makeStyles, createStyles } from '@mui/styles';
import { Theme } from '@mui/material';

export const useCreateProjectModalStyles = makeStyles((theme: Theme) =>
	createStyles({
		containter: {
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
		},
		optionsContainer: {
			marginTop: theme.spacing(3),
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'space-around',
		},
	})
);

export const useCreateProjectOptionStyles = makeStyles((theme: Theme) =>
	createStyles({
		containter: {
			width: '200px',
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			textAlign: 'center',
			padding: theme.spacing(1),
			overflow: 'hidden',
			position: 'relative',
			borderRadius: theme.shape.borderRadius,
		},
	})
);
