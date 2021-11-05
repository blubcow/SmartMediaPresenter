import { makeStyles, createStyles } from '@mui/styles';
import { Theme } from '@mui/material';

export default makeStyles((theme: Theme) =>
	createStyles({
		root: {
			padding: theme.spacing(1),
		},
		container: {
			borderRadius: theme.shape.borderRadius,
			overflow: 'hidden',
			border: '1px solid ' + theme.palette.background.paper,
			filter: `drop-shadow(0 0 0.5rem ${theme.palette.divider})`,
		},
		baseContainer: {
			height: '100%',
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'space-between',
			paddingLeft: theme.spacing(5),
			paddingRight: theme.spacing(5),
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
