import { makeStyles, createStyles, StyledProps } from '@mui/styles';
import { Theme } from '@mui/material';

export default makeStyles<Theme>((theme: Theme) =>
	createStyles({
		droppingArea: {
			height: '100%',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			backgroundColor: theme.palette.divider,
		},
		droppingAreaFrame: {
			height: '100%',
			width: '100%',
			border: '3px dashed ' + theme.palette.background.paper,
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
		},
		img: {
			maxWidth: '100%',
			maxHeight: '100%',
		},
	})
);
