import { makeStyles, createStyles } from '@mui/styles';
import { Theme } from '@mui/material';

export default makeStyles((theme: Theme) =>
	createStyles({
		slidesContainer: {
			flex: 0.25,
			minWidth: '350px',
			maxWidth: '450px',
			height: '100%',
		},
		rowsScrollingContainer: {
			height: '100%',
			overflowY: 'scroll',
		},
	})
);
