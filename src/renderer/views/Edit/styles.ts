import { createStyles, makeStyles, Theme } from '@mui/material';

export default makeStyles((theme: Theme) =>
	createStyles({
		container: {
			width: '100%',
			height: '100%',
			display: 'flex',
			// overflow: 'hidden',
		},
		previewContainer: {
			height: '100%',
			flex: 1,
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			paddingTop: theme.spacing(4),
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
