import { makeStyles, createStyles, StyledProps } from '@mui/styles';
import { Theme } from '@mui/material';

export default makeStyles<Theme>((theme: Theme) =>
	createStyles({
		container: {
			backgroundColor: 'divider',
		},
		droppingArea: {
			height: '100%',
			border: '3px dashed ' + theme.palette.background.paper,
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
		},
		img: {
			width: '100%',
			height: '100%',
		},
	})
);
