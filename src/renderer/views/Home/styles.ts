import { createStyles, makeStyles } from '@mui/styles';
import { Theme } from '@mui/material';

export default makeStyles((theme: Theme) =>
	createStyles({
		container: {
			width: '100%',
			height: '100%',
			display: 'flex',
		},
		rowsContainer: {
			flex: 0.3,
			minWidth: '450px',
			maxWidth: '600px',
			height: '100%',
		},
		rowsScrollingContainer: {
			height: '100%',
			overflowY: 'scroll',
		},
		previewContainer: {
			height: '100%',
			flex: 1,
		},
		noPresentationSelectedContainer: {
			height: '100%',
			width: '100%',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
		},
	})
);

export const useTopBarStyles = makeStyles((theme: Theme) =>
	createStyles({
		contaiener: {
			height: '100%',
			width: '100%',
			display: 'flex',
			justifyContent: 'space-between',
			alignItems: 'center',
		},
		logoContainer: {
			height: '55%',
		},
		img: {
			height: '100%',
		},
	})
);
