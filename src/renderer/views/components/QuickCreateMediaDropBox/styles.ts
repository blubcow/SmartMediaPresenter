import { createStyles, makeStyles, Theme } from '@mui/material';

export default makeStyles = makeStyles((theme: Theme) =>
	createStyles({
		container: {
			height: '100%',
			flex: 0.6,
			display: 'flex',
			alignItems: 'center',
			flexDirection: 'column',
			zIndex: 1,
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
		rowsContainer: {
			width: '100%',
			flex: 1,
			display: 'flex',
			alignItems: 'center',
			overflowY: 'scroll',
			flexDirection: 'column',
			justifyContent: 'start',
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
		labelBtnContainer: {
			display: 'flex',
			flexDirection: 'column',
			gap: theme.spacing(0.5),
		},
		labelBtn: {
			color: theme.palette.text.primary,
			cursor: 'pointer',
			textShadow: theme.shadows[5],
			'&:hover': {
				color: theme.palette.primary.main,
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

export const useRemoteFileExplorerStyles = makeStyles((theme: Theme) =>
	createStyles({
		container: {
			width: '100%',
			flex: 1,
			display: 'flex',
			overflowY: 'scroll',
			flexDirection: 'column',
			position: 'relative',
		},
		navigator: {
			width: '100%',
			padding: theme.spacing(1),
			display: 'flex',
			alignItems: 'center',
			gap: theme.spacing(1),
			backgroundColor: theme.palette.divider,
		},
		inidicator: {
			position: 'absolute',
			left: '50%',
			top: '50%',
			transform: 'translate(-50%, -50%)',
		},
		rowsContainer: {
			width: '100%',
			display: 'flex',
			alignItems: 'center',
			overflowY: 'scroll',
			flexDirection: 'column',
			justifyContent: 'start',
			maxHeight: '100%',
		},
		row: {
			width: '100%',
			cursor: 'pointer',
			display: 'flex',
			gap: theme.spacing(1),
			alignItems: 'center',
			padding: theme.spacing(1),
		},
		imgContainer: {
			height: '100%',
			width: '50px',
			aspectRatio: '16/9',
			display: 'flex',
			justifyContent: 'center',
			userSelect: 'none',
			pointerEvents: 'none',
		},
		icon: {
			fontSize: '30px',
			color: theme.palette.text.primary,
		},
		img: {
			height: '100%',
			maxWidth: '100%',
		},
	})
);
