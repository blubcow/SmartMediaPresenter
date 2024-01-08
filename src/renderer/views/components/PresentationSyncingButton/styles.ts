import { createStyles, makeStyles } from '@mui/styles';
import { Theme } from '@mui/material';

export default makeStyles((theme: Theme) =>
	createStyles({
		button: {
			height: '65px',
			width: '65px',
			minWidth: '65px',
			borderRadius: '50%',
			outlineColor: theme.palette.text.primary,
			outlineStyle: 'solid',
			outlineWidth: '1px',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			cursor: 'pointer',
			'&:hover': {
				backgroundColor: theme.palette.background.paper,
			},
		},
		icon: {
			fontSize: '30px',
		},
	})
);
