import { makeStyles, createStyles } from '@mui/styles';
import { Theme } from '@mui/material';

export default makeStyles<Theme>((theme: Theme) =>
	createStyles({
		droppingArea: {
			height: '100%',
			width: '100%',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			padding: theme.spacing(1),
		},
		droppingAreaFrame: {
			height: '100%',
			width: '100%',
			border: '3px dashed ' + theme.palette.background.paper,
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
		},
	})
);
