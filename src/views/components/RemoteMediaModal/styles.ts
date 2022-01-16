import { createStyles, makeStyles } from '@mui/styles';
import { Theme } from '@mui/material';

export default makeStyles((theme: Theme) =>
	createStyles({
		container: {
			width: '850px',
			height: '70vh',
			display: 'flex',
			flexDirection: 'column',
		},
		header: {
			display: 'flex',
			justifyContent: 'space-between',
			alignItems: 'center',
			paddingBottom: theme.spacing(3),
		},
		headerBtnContainer: {
			display: 'flex',
			alignItems: 'center',
			gap: theme.spacing(1),
		},
		btnIcon: {
			marginRight: theme.spacing(0.5),
		},
		content: {
			flex: 1,
		},
		footerBtnContainer: {
			display: 'flex',
			justifyContent: 'space-between',
			alignItems: 'center',
			paddingTop: theme.spacing(3),
		},
	})
);
