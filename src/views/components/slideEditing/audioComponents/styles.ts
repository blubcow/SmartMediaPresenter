import { makeStyles, createStyles } from '@mui/styles';
import { Theme } from '@mui/material';

export const useOptionRowStyles = makeStyles((theme: Theme) =>
	createStyles({
		rowContainer: {
			minHeight: '50px',
			width: '100%',
		},
		btnBase: { width: '100%' },
		optionRow: {
			height: '100%',
			width: '100%',
			padding: theme.spacing(2),
			display: 'flex',
			flexDirection: 'row',
			alignContent: 'center',
			justifyContent: 'flex-start',
			cursor: 'pointer',
			'&:hover': {
				backgroundColor: theme.palette.divider,
			},
		},
		optionRowIcon: {
			marginRight: theme.spacing(2),
		},
	})
);
