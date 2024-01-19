import { createStyles, makeStyles, Theme } from '@mui/material';

export const useCreateProjectModalStyles = makeStyles((theme: Theme) =>
	createStyles({
		containter: {
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
		},
		optionsContainer: {
			marginTop: theme.spacing(3),
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'space-around',
		},
	})
);

export const useCreateProjectOptionStyles = makeStyles((theme: Theme) =>
	createStyles({
		containter: {
			width: '200px',
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			textAlign: 'center',
			padding: theme.spacing(1),
			overflow: 'hidden',
			position: 'relative',
			borderRadius: theme.shape.borderRadius,
		},
	})
);

export const useActionConfirmationModalStyles = makeStyles((theme: Theme) =>
	createStyles({
		contentContainer: {
			width: '450px',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			textAlign: 'center',
			padding: theme.spacing(1),
		},
		secondaryTextContainer: {
			textAlign: 'center',
			padding: theme.spacing(3),
		},
		buttonContainer: {
			display: 'flex',
			justifyContent: 'space-between',
		},
	})
);

export const useLocalOrRemoteModalStyles = makeStyles((theme: Theme) =>
	createStyles({
		container: {
			display: 'flex',
			flexDirection: 'column',
			gap: theme.spacing(3),
			alignItems: 'center',
			justifyContent: 'center',
		},
		btns: {
			display: 'flex',
			gap: theme.spacing(3),
		},
		btn: {
			padding: theme.spacing(1),
			width: '100px',
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			justifyContent: 'center',
			gap: theme.spacing(1),
			textAlign: 'center',
			borderRadius: theme.shape.borderRadius,
			transition: 'box-shadow 0.2s ease',
			boxShadow: theme.shadows[5],
			cursor: 'pointer',
			'&:hover': {
				boxShadow: theme.shadows[20],
			},
		},
	})
);

export const useImportLocalPresentationsModalStyles = makeStyles(
	(theme: Theme) =>
		createStyles({
			container: {
				width: '350px',
				display: 'flex',
				flexDirection: 'column',
				gap: theme.spacing(3),
				alignItems: 'center',
				textAlign: 'center',
			},
			btnContainer: {
				width: '100%',
				display: 'flex',
				justifyContent: 'space-between',
			},
		})
);
