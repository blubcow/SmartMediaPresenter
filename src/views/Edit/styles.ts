import { makeStyles, createStyles } from '@mui/styles';
import { Theme } from '@mui/material';

export default makeStyles((theme: Theme) =>
	createStyles({
		container: {
			width: '100%',
			height: '100%',
			display: 'flex',
		},
		previewContainer: {
			height: '100%',
			flex: 0.85,
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
		},
		loadingContainer: {
			height: '100vh',
			width: '100vw',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
		},
	})
);
