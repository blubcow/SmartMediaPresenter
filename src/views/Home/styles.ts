import { makeStyles, createStyles } from '@mui/styles';
import { Theme } from '@mui/material';

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
