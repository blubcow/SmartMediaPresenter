import { makeStyles, createStyles } from '@mui/styles';
import { Theme } from '@mui/material';

export default makeStyles((theme: Theme) =>
	createStyles({
		container: {
			width: '100%',
			height: '100%',
			display: 'flex',
		},
	})
);
