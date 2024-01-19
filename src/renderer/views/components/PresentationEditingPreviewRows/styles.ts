import { createStyles, makeStyles, Theme } from '@mui/material';

export default makeStyles((theme: Theme) =>
	createStyles({
		slidesContainer: {
			flex: 0.25,
			minWidth: '400px',
			maxWidth: '450px',
			height: '100%',
		},
		rowsScrollingContainer: {
			height: '100%',
			overflowY: 'scroll',
		},
	})
);
