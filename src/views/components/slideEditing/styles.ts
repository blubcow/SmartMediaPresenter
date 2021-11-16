import { createStyles, makeStyles } from '@mui/styles';
import { Theme } from '@mui/material';

export default makeStyles((theme: Theme) =>
	createStyles({
		card: {
			height: '100px',
			width: '75px',
			backgroundColor: theme.palette.background.paper,
			borderRadius: theme.shape.borderRadius,
			cursor: 'pointer',
			outlineColor: theme.palette.primary.main,
			outlineStyle: 'solid',
			['&:hover']: {
				backgroundColor: theme.palette.divider,
			},
		},
		container: {
			height: '100%',
			width: '100%',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
		},
		iconContainer: {
			height: '45px',
			width: '45px',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			marginBottom: theme.spacing(1),
		},
		secondaryContainer: {
			maxWidth: '90%',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			overflow: 'hidden',
		},
	})
);

export const useSlideSettingsStyles = makeStyles((theme: Theme) =>
	createStyles({
		container: {
			width: '100%',
			display: 'flex',
			justifyContent: 'flex-end',
		},
		spacer: {
			width: theme.spacing(2),
		},
	})
);
