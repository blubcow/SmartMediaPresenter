import { makeStyles, createStyles } from '@mui/styles';
import { Theme } from '@mui/material';

export default makeStyles((theme: Theme) =>
	createStyles({
		container: {
			width: '100%',
			height: '100%',
			display: 'flex',
		},
		slidesContainer: {
			flex: 0.25,
			minWidth: '350px',
			height: '100%',
		},
		rowsScrollingContainer: {
			height: '100%',
			overflowY: 'scroll',
		},
		previewContainer: {
			height: '100%',
			flex: 0.85,
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
		},
		slideCounterContainer: {
			width: '100%',
			paddingLeft: theme.spacing(1),
		},
	})
);
