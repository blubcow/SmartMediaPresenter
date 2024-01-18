import React from 'react';
import IconFrame from './IconFrame';
import { Box } from '../../../smpUI/components';
import { useAudioRecordingIconStyles } from './styles';

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
