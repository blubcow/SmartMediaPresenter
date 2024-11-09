import React from 'react';
import IconFrame from './IconFrame';
import { Box } from '@mui/material';
import { createStyles, makeStyles } from '@mui/styles';
import { Theme } from '@mui/material';

const baseBarStyle = (theme: Theme) => ({
	width: '3px',
	height: '70%',
	borderRadius: '1.5px',
	backgroundColor: theme.palette.secondary.main,
});

const useAudioIconStyles = makeStyles((theme: Theme) =>
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

interface IAudioIconProps {
	isPlaying: boolean;
}

const AudioIcon: React.FC<IAudioIconProps> = (props) => {
	const { isPlaying } = props;
	const classes = useAudioIconStyles();

	return (
		<IconFrame
			icon={
				<Box className={classes.container}>
					<Box className={isPlaying ? classes.bar3Animated : classes.bar3} />
					<Box className={classes.spacer} />
					<Box className={isPlaying ? classes.bar4Animated : classes.bar2} />
					<Box className={classes.spacer} />
					<Box className={isPlaying ? classes.bar1Animated : classes.bar1} />
					<Box className={classes.spacer} />
					<Box className={isPlaying ? classes.bar2Animated : classes.bar2} />
					<Box className={classes.spacer} />
					<Box className={isPlaying ? classes.bar3Animated : classes.bar3} />
				</Box>
			}
		/>
	);
};

export default AudioIcon;
