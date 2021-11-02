import { makeStyles, createStyles } from '@mui/styles';
import { Theme } from '@mui/material';

export default makeStyles((theme: Theme) =>
	createStyles({
		container: {
			width: '100%',
			height: '100%',
			display: 'flex',
		},
		rowsContainer: {
			height: '100%',
			flex: 0.3,
			display: 'flex',
			flexDirection: 'column',
			overflow: 'scroll',
		},
		previewContainer: {
			height: '100%',
			flex: 0.7,
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
