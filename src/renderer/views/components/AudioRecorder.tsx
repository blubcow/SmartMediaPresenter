import React, { useState, useEffect } from 'react';
import { useAudioStore } from '../../hooks/useMainProcessMethods';
import { EditableText } from '../../smpUI/EditableText';
import { Box, BoxProps, Button} from '@mui/material';
import AudioRecordingIcon from '../icons/AudioRecordingIcon';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../i18n/i18n';
import useMediaStreamRecorder from '../../hooks/useMediaStreamRecorder';
import { createStyles, makeStyles } from '@mui/styles';
import { Theme } from '@mui/material';
import { formatTimer } from '../../shared/format.utils';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		container: {
			minWidth: '180px',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
		},
		iconTimerContainer: {
			padding: theme.spacing(2),
			display: 'flex',
			justifyContent: 'space-between',
			alignItems: 'center',
		},
	})
);


interface IAudioRecorderProps extends BoxProps {
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
			<EditableText variant='h6'>{formatTimer(timer)}</EditableText>
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
