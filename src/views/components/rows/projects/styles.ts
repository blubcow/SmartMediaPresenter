import { makeStyles, createStyles } from '@mui/styles';
import { Theme } from '@mui/material';

export default makeStyles((theme: Theme) =>
	createStyles({
		container: {
			height: '135px',
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'space-between',
			padding: theme.spacing(5),
			alignItems: 'center',
		},
		textContainer: {
			height: '100%',
			width: 'auto',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
		},
		infoLabel: {
			marginTop: theme.spacing(1),
			color: theme.palette.text.secondary,
		},
	})
);
