import { makeStyles, createStyles } from '@mui/styles';
import { Theme } from '@mui/material';

export default makeStyles((theme: Theme) =>
	createStyles({
		root: {
			padding: theme.spacing(1),
		},
		container: {
			borderRadius: theme.shape.borderRadius,
			overflow: 'hidden',
			border: '1px solid ' + theme.palette.background.paper,
			filter: `drop-shadow(0 0 0.5rem ${theme.palette.divider})`,
		},
	})
);
