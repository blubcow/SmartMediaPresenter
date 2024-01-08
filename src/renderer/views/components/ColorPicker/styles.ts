import { createStyles, makeStyles } from '@mui/styles';
import { Theme } from '@mui/material';

export default makeStyles((theme: Theme) =>
	createStyles({
		picker: {
			backgroundColor: 'transparent',
			color: theme.palette.text.primary,
		},
	})
);
