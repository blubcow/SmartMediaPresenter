import React from 'react';
import IconFrame from './IconFrame';
import { Box } from '../../smpUI';
import { createStyles, makeStyles } from '@mui/styles';
import { Theme } from '@mui/material';

const useAudioRecordingIconStyles = makeStyles((theme: Theme) =>
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

interface IAudioRecordingIconProps {
	isRecording: boolean;
}

const AudioRecordingIcon: React.FC<IAudioRecordingIconProps> = (props) => {
	const { isRecording } = props;
	const classes = useAudioRecordingIconStyles();

	return (
		<IconFrame
			icon={
				<Box
					className={
						isRecording
							? classes.recordingIconAnimating
							: classes.recordingIconStill
					}
				/>
			}
		/>
	);
};

export default AudioRecordingIcon;
