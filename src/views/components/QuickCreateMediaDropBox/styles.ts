import { makeStyles, createStyles } from '@mui/styles';
import { Theme } from '@mui/material';

export default makeStyles((theme: Theme) =>
	createStyles({
		container: {
			height: '100%',
			flex: 0.6,
			display: 'flex',
			alignItems: 'center',
			overflowY: 'scroll',
			flexDirection: 'column',
			justifyContent: 'start',
		},
		infoText: {
			flex: 1,
			width: '100%',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			textAlign: 'center',
		},
	})
);

export const useHeaderRowStyles = makeStyles((theme: Theme) =>
	createStyles({
		container: {
			width: '100%',
			minHeight: '95px',
			backgroundColor: theme.palette.background.paper,
			position: 'sticky',
			top: 0,
			padding: theme.spacing(2),
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'space-between',
		},
		addFiles: {
			color: theme.palette.text.primary,
			cursor: 'pointer',
			'&:hover': {
				color: theme.palette.text.secondary,
			},
		},
		searchInput: {
			maxWidth: '30%',
		},
		orderingContainer: {
			height: '100%',
			width: '30%',
			display: 'flex',
			justifyContent: 'flex-end',
		},
		spacer: {
			width: theme.spacing(2),
		},
	})
);

export const useMediaRowStyles = makeStyles((theme: Theme) =>
	createStyles({
		container: {
			width: '100%',
			padding: theme.spacing(1),
			display: 'flex',
			cursor: 'pointer',
			zIndex: 1,
			'&:focus': {
				outline: 'none',
			},
		},
		selected: {
			width: '100%',
			padding: theme.spacing(1),
			display: 'flex',
			zIndex: 1,
			'&:focus': {
				outline: 'none',
			},
		},
		row: {
			maxHeight: '20px',
			cursor: 'grab',
			display: 'flex',
		},
		imgContainer: {
			height: '100%',
			aspectRatio: '16/9',
			display: 'flex',
			justifyContent: 'center',
		},
		img: {
			height: '100%',
			maxWidth: '100%',
		},
		txtContainer: {
			marginLeft: theme.spacing(2),
		},
	})
);
