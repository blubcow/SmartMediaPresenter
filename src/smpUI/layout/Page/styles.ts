import { makeStyles, createStyles } from '@mui/styles';
import { Theme } from '@mui/material';

export default makeStyles((theme: Theme) => {
	return createStyles({
		root: {
			minHeight: '100vh',
			height: '1px',
			backgroundColor: theme.palette.background.default,
			display: 'flex',
			flexDirection: 'column',
			overflow: 'hidden',
		},
		contentContainer: {
			height: '0px',
			flex: 1,
			width: '100%',
		},
		centeredContentBox: {
			height: '100%',
			maxHeight: '100%',
			width: '100%',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			paddingLeft: theme.spacing(3),
			paddingRight: theme.spacing(3),
		},
	});
});
