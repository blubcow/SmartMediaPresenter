import React, { useState, useEffect } from 'react';
import {
	ReactMediaRecorder,
	ReactMediaRecorderProps,
} from 'react-media-recorder';
import { useAudioStore } from '../../../hooks/useMainProcessMethods';
import { Box, Button, Text } from '../../../smpUI/components';
import AudioRecordingIcon from '../AnimatedIcon/AudioRecordingIcon';
import useStyles from './styles';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';
import { formatTimer } from '../../../util/Formatter';

interface IAudioRecorderProps extends Omit<ReactMediaRecorderProps, 'render'> {
	presId: number;
	onRecordingReceived: (path: string) => void;
}

const AudioRecorder: React.FC<IAudioRecorderProps> = (props) => {
	const { presId, onRecordingReceived } = props;
	const { storeAudio } = useAudioStore();
	const classes = useStyles();
	const { t } = useTranslation([i18nNamespace.Presentation]);

	const [recording, setRecording] = useState<boolean>(false);
	const [stopRecording, setStopRecording] = useState<() => void>();
	const [timer, setTimer] = useState<number>(0);

	useEffect(() => {
		if (!recording) return;
		setTimer(0);
		const timer = setInterval(() => setTimer((curr) => curr + 1), 1000);

		return () => clearInterval(timer);
	}, [recording]);

	useEffect(() => {
		return () => {
			if (recording && stopRecording) stopRecording();
		};
	}, []);

	return (
		<ReactMediaRecorder
			{...props}
			video={false}
			audio
			onStop={async (_, blob) => {
				if (recording) return;
				const buffer = Buffer.from(await blob.arrayBuffer());
				const filePath = await storeAudio(presId, buffer);
				onRecordingReceived(filePath);
			}}
			render={({ startRecording, stopRecording }) => {
				return (
					<Box className={classes.container}>
						<Box className={classes.iconTimerContainer}>
							<AudioRecordingIcon isRecording={recording} />
							<Text variant='h6'>{formatTimer(timer)}</Text>
						</Box>
						<Button
							variant='contained'
							color='secondary'
							onClick={() => {
								if (!recording) {
									setRecording(true);
									startRecording();
									setStopRecording(stopRecording);
								} else {
									setRecording(false);
									stopRecording();
								}
							}}
						>
							{t(recording ? 'stopRecording' : 'startRecording')}
						</Button>
					</Box>
				);
			}}
		/>
	);
};

export default AudioRecorder;
