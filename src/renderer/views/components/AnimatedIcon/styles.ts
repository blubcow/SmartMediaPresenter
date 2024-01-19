import { createStyles, makeStyles, Theme } from '@mui/material';

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

const baseBarStyle = (theme: Theme) => ({
	width: '3px',
	height: '70%',
	borderRadius: '1.5px',
	backgroundColor: theme.palette.secondary.main,
});

export const useAudioIconStyles = makeStyles((theme: Theme) =>
	createStyles({
		container: {
			width: '100%',
			height: '100%',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
		},
		spacer: { width: theme.spacing(0.5) },
		bar1Animated: {
			...baseBarStyle(theme),
			animation: '$bar1Animation 0.5s infinite linear alternate',
		},
		bar2Animated: {
			...baseBarStyle(theme),
			animation: '$bar2Animation 1s infinite linear',
		},
		bar3Animated: {
			...baseBarStyle(theme),
			animation: '$bar3Animation 0.5s infinite linear alternate',
		},
		bar4Animated: {
			...baseBarStyle(theme),
			animation: '$bar4Animation 1s infinite linear',
		},
		bar1: {
			...baseBarStyle(theme),
		},
		bar2: {
			...baseBarStyle(theme),
			transform: 'scale(1, 0.7)',
		},
		bar3: {
			...baseBarStyle(theme),
			transform: 'scale(1, 0.4)',
		},
		'@keyframes bar1Animation': {
			'0%': {
				transform: 'scale(1, 1)',
			},
			'100%': {
				transform: 'scale(1, 0.4)',
			},
		},
		'@keyframes bar2Animation': {
			'0%': {
				transform: 'scale(1, 0.7)',
			},
			'25%': {
				transform: 'scale(1, 1)',
			},
			'75%': {
				transform: 'scale(1, 0.4)',
			},
			'100%': {
				transform: 'scale(1, 0.7)',
			},
		},
		'@keyframes bar4Animation': {
			'0%': {
				transform: 'scale(1, 0.7)',
			},
			'25%': {
				transform: 'scale(1, 0.4)',
			},
			'75%': {
				transform: 'scale(1, 1)',
			},
			'100%': {
				transform: 'scale(1, 0.7)',
			},
		},
		'@keyframes bar3Animation': {
			'0%': {
				transform: 'scale(1, 0.4)',
			},
			'100%': {
				transform: 'scale(1, 1)',
			},
		},
	})
);
