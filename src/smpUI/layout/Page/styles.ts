import { makeStyles, createStyles } from '@mui/styles';
import { Theme } from '@mui/material';

export default makeStyles((theme: Theme) => {
	console.log(theme.mixins.toolbar.height);
	return createStyles({
		root: {
			minHeight: '100vh',
			height: '1px',
			backgroundColor: theme.palette.background.default,
			display: 'flex',
			flexDirection: 'column',
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
		},
	});
});
