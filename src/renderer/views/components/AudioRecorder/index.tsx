import React, { useState, useEffect } from 'react';
import { useAudioStore } from '../../../hooks/useMainProcessMethods';
import { Box, Button, Text } from '../../../smpUI/components';
import AudioRecordingIcon from '../AnimatedIcon/AudioRecordingIcon';
import useStyles from './styles';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';
import { formatTimer } from '../../../util/Formatter';
import { IBoxProps } from '../../../smpUI/components/Box';
import useMediaStreamRecorder from '../../../hooks/useMediaStreamRecorder';


interface IAudioRecorderProps extends IBoxProps {
	presId: number;
	onRecordingReceived: (path: string) => void;
}

const AudioRecorder: React.FC<IAudioRecorderProps> = (props) => {
	const { presId, onRecordingReceived, ...boxProps } = props;
	const { storeAudio } = useAudioStore();
	const classes = useStyles();
	const { t } = useTranslation([i18nNamespace.Presentation]);
	const [timer, setTimer] = useState<number>(0);

	const {
		isRecording,
		startRecording,
		stopRecording
	} = useMediaStreamRecorder();

	// Visual timer representation when recording has started
	useEffect(() => {
		if (!isRecording) return;
		setTimer(0);
		const timer = setInterval(() => setTimer((curr) => curr + 1), 1000);

		return function cleanup(){
			clearInterval(timer);
		}
	}, [isRecording]);

	return (<Box className={classes.container} {...boxProps}>
		<Box className={classes.iconTimerContainer}>
			<AudioRecordingIcon isRecording={isRecording} />
			<Text variant='h6'>{formatTimer(timer)}</Text>
		</Box>
		<Button
			variant='contained'
			color='secondary'
			onClick={async () => {
				if (!isRecording) {
					startRecording();
				} else {
					const blob = await stopRecording();

					// For debugging
					// window.electron.invoke('saveBufferToFile', buffer);
					// const blobUrl = URL.createObjectURL(blob);
					const buffer = Buffer.from(await blob.arrayBuffer());
					const filePath = await storeAudio(presId, buffer);
					onRecordingReceived(filePath);
				}
			}}
		>
			{t(isRecording ? 'stopRecording' : 'startRecording')}
		</Button>
	</Box>);
};

export default AudioRecorder;
