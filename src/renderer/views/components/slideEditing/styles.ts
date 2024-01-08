import { createStyles, makeStyles } from '@mui/styles';
import { Theme } from '@mui/material';

export default makeStyles((theme: Theme) =>
	createStyles({
		editingCard: {
			height: '100px',
			width: '95px',
			borderRadius: theme.shape.borderRadius,
			cursor: 'pointer',
			outlineColor: theme.palette.primary.main,
			outlineStyle: 'solid',
			'&:hover': {
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

export const useSettingsContainerStyles = makeStyles((theme: Theme) =>
	createStyles({
		container: {
			minWidth: '100%',
			maxWidth: '100%',
			display: 'flex',
			justifyContent: 'flex-end',
		},
		spacer: {
			width: theme.spacing(1),
		},
	})
);

export const useImageManipulationControlsStyles = makeStyles((theme: Theme) =>
	createStyles({
		container: {
			height: '100%',
			width: '500px',
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			padding: theme.spacing(2),
			justifyContent: 'space-between',
		},
		img: {
			marginTop: theme.spacing(3),
			maxHeight: '170px',
			maxWidth: '100%',
		},
		optionsContainer: {
			paddingTop: theme.spacing(2),
			width: '100%',
		},
		optionContainer: {
			width: '100%',
			maxHeight: '45px',
		},
		slider: {
			width: '100%',
		},
		btnContainer: {
			width: '100%',
			display: 'flex',
			justifyContent: 'space-between',
		},
	})
);

export const useMediaEditingModalStyles = makeStyles((theme: Theme) =>
	createStyles({
		container: {
			height: '100%',
			width: '450px',
			padding: theme.spacing(2),
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'space-between',
			alignItems: 'center',
		},
		contentContainer: {
			marginTop: theme.spacing(3),
			marginBottom: theme.spacing(3),
		},
		btnContainer: {
			width: '100%',
			display: 'flex',
			justifyContent: 'space-between',
		},
	})
);

export const useAudioButtonStyles = makeStyles((theme: Theme) =>
	createStyles({
		popover: {
			display: 'flex',
			flexDirection: 'column',
			minWidth: '250px',
		},
	})
);

export const useEditThemeDrawerStyles = makeStyles((theme: Theme) =>
	createStyles({
		container: {
			display: 'flex',
		},
		content: {
			minWidth: '450px',
			display: 'flex',
			flexDirection: 'column',
			height: '100%',
			justifyContent: 'space-between',
			padding: theme.spacing(1),
		},
		rowContainer: {
			display: 'flex',
			flexDirection: 'column',
			overflow: 'scroll',
		},
		btnContainer: {
			padding: theme.spacing(1),
			width: '100%',
			display: 'flex',
			justifyContent: 'flex-end',
		},
	})
);

export const useTextFontSelectionOptionStyles = makeStyles((theme: Theme) =>
	createStyles({
		container: {
			padding: theme.spacing(1),
			cursor: 'pointer',
			'&:hover': {
				backgroundColor: theme.palette.background.default,
			},
		},
	})
);
