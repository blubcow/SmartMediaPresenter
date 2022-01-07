import { makeStyles, createStyles } from '@mui/styles';
import { Theme } from '@mui/material';

export default makeStyles((theme: Theme) =>
	createStyles({
		container: {
			aspectRatio: '16/9',
			width: '100%',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',

			position: 'relative',
		},
		presentationFrame: {
			position: 'absolute',
			top: 0,
			left: 0,
			height: '50%',
			width: '100%',
			outlineStyle: 'solid',
			pointerEvents: 'none',
			zIndex: 10,
		},
		mediaContainer: {
			height: '100%',
			width: '100%',
			display: 'flex',
			flexDirection: 'column',
		},
		rowContainer: {
			display: 'flex',
			flexDirection: 'row',
			height: '100%',
			justifyContent: 'center',
			alignItems: 'center',
		},
	})
);

export const useLoadingIndicatorStyles = makeStyles((theme: Theme) =>
	createStyles({
		container: {
			padding: theme.spacing(1),
			backgroundColor: theme.palette.background.paper,
			borderRadius: theme.shape.borderRadius,
			display: 'flex',
			position: 'absolute',
			marginLeft: 'auto',
			textAlign: 'center',
			left: '50%',
			bottom: theme.spacing(2),
			outlineWidth: '1px',
			outlineColor: theme.palette.primary.main,
			outlineStyle: 'solid',
			alignItems: 'center',
			zIndex: 100,
			// center the badge horizontally
			transform: 'translate(-50%, 0)',
		},
		spinner: {
			marginRight: theme.spacing(2),
		},
	})
);
