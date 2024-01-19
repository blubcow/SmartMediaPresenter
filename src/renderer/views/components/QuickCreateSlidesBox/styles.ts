import { createStyles, makeStyles, Theme } from '@mui/material';

export default makeStyles((theme: Theme) =>
	createStyles({
		container: {
			height: '100%',
			flex: 0.4,
			display: 'flex',
			flexDirection: 'column',
			zIndex: 1,
			overflowY: 'visible',
		},
		previewContainer: {
			width: '100%',
			aspectRatio: '16/9',
			background: 'black',
		},
		slideScrollingContainer: {
			width: '100%',
			flex: 1,
			display: 'flex',
			flexDirection: 'column',
			overflowY: 'scroll',
			alignItems: 'center',
			paddingBottom: theme.spacing(2),
		},
	})
);

export const useHedaerRowStyles = makeStyles((theme: Theme) =>
	createStyles({
		container: {
			width: '100%',
			padding: theme.spacing(1),
			position: 'sticky',
			top: 0,
			cursor: 'pointer',
			display: 'flex',
			backgroundColor: theme.palette.background.paper,
		},
		alphapeticalInsert: {
			flex: 1,
			height: '100%',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			userSelect: 'none',
		},
		addNewSlide: {
			display: 'flex',
			flex: 1,
			height: '100%',
			justifyContent: 'center',
			alignItems: 'center',
			userSelect: 'none',
			'&:hover': {
				backgroundColor: theme.palette.divider,
			},
		},
	})
);

export const useSlideRowStyles = makeStyles((theme: Theme) =>
	createStyles({
		container: {
			width: '95%',
			display: 'flex',
			backgroundColor: theme.palette.divider,
			marginTop: theme.spacing(1),
			outlineColor: theme.palette.primary.main,
		},
	})
);

export const useSlideRowMediaHolderStyles = makeStyles((theme: Theme) =>
	createStyles({
		container: {
			height: '100%',
		},
		mediaPresentContainer: {
			height: '100%',
			width: '100%',
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			justifyContent: 'center',
		},
		mediaPresentImg: {
			maxHeight: '50%',
		},
		noMediaPresentContainer: {
			height: '100%',
			width: '100%',
			padding: theme.spacing(0.5),
		},
		noMediaPresentIndicatorBox: {
			height: '100%',
			width: '100%',
			backgroundColor: theme.palette.background.default,
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			borderRadius: theme.shape.borderRadius,
		},
	})
);

export const useMultiInsertionStyles = makeStyles((theme: Theme) =>
	createStyles({
		container: {
			height: '100%',
			width: '100%',
			display: 'flex',
		},
		insertionColumn: {
			height: '100%',
			width: '50%',
			padding: theme.spacing(1),
		},
	})
);
