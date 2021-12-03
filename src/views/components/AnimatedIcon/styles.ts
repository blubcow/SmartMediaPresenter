import { makeStyles, createStyles } from '@mui/styles';
import { Theme } from '@mui/material';

export const useIconFrameStyles = makeStyles((theme: Theme) =>
	createStyles({
		iconFrame: {
			width: '60px',
			height: '60px',
			borderRadius: '50%',
			backgroundColor: 'transparent',
			outlineColor: theme.palette.text.secondary,
			outlineStyle: 'solid',
			outlineWidth: '1px',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
		},
	})
);

export const useAudioRecordingIconStyles = makeStyles((theme: Theme) =>
	createStyles({
		recordingIconAnimating: {
			height: '15px',
			width: '15px',
			borderRadius: '50%',
			backgroundColor: theme.palette.secondary.main,
			animation: '$recordingAnimation 0.6s infinite alternate',
		},
		recordingIconStill: {
			height: '15px',
			width: '15px',
			borderRadius: '50%',
			backgroundColor: theme.palette.secondary.main,
			transition: '0.5s ease',
		},
		'@keyframes recordingAnimation': {
			'0%': {
				opacity: 1,
			},
			'100%': {
				opacity: 0,
			},
		},
	})
);
