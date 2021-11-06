import { makeStyles, createStyles } from '@mui/styles';
import { Theme } from '@mui/material';

export default makeStyles((theme: Theme) =>
	createStyles({
		editableText: {
			height: '100%',
			width: '100%',
			border: 0,
			outline: 0,
			backgroundColor: 'inherit',
			fontFamily: 'inherit',
			fontWeight: 'inherit',
			fontSize: 'inherit',
			color: 'inherit',
		},
	})
);
