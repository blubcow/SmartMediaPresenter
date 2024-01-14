import React, { useState, useEffect } from 'react';
import { useAudioStore } from '../../../hooks/useMainProcessMethods';
import { Box, Button, Text } from '../../../smpUI/components';
import AudioRecordingIcon from '../AnimatedIcon/AudioRecordingIcon';
import useStyles from './styles';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';
import { formatTimer } from '../../../util/Formatter';
import { IBoxProps } from '../../../smpUI/components/Box';


interface IAudioRecorderProps extends IBoxProps {
	presId: number;
	onRecordingReceived: (path: string) => void;
}

const AudioRecorder: React.FC<IAudioRecorderProps> = (props) => {
	const { presId, onRecordingReceived, ...boxProps } = props;
	const { storeAudio } = useAudioStore();
	const classes = useStyles();
	const { t } = useTranslation([i18nNamespace.Presentation]);

	const [isRecording, setIsRecording] = useState<boolean>(false);
	const [recorder, setRecorder] = useState<MediaRecorder>();
	const [timer, setTimer] = useState<number>(0);

	// Visual timer representation when recording has started
	useEffect(() => {
		if (!isRecording) return;
		setTimer(0);
		const timer = setInterval(() => setTimer((curr) => curr + 1), 1000);

		return function cleanup(){
			clearInterval(timer);
		}
	}, [isRecording]);

	// On dismount, stop recording without saving file
	useEffect(() => {
		return function cleanup(){
			if (isRecording) stopRecording(false);
		};
	}, []);

	async function startRecording(){
		// TODO: in mac osx, "systemPreferences.askForMediaAccess('microphone')" needs to run on main process

		// TODO: Add a try catch block with a popup, to show the error to the user (mime type etc.?)
		const stream:MediaStream = await navigator.mediaDevices.getUserMedia(getAudioCaptureConstraints());
		//Use "stream.addTrack()" to add audio to video tracks 
		
		const options = { mimeType: '' };
		if(MediaRecorder.isTypeSupported('audio/webm; codecs="opus"')){
			options.mimeType = 'audio/webm; codecs="opus"';
		}else if(MediaRecorder.isTypeSupported('audio/webm')){
			options.mimeType = 'audio/webm';
		}else{
			throw new Error("WebM audio recording is not supported");
		}

		const recorder = new MediaRecorder(stream, options);
		setRecorder(recorder);
		
		recorder.start();
		setIsRecording(true);
	}

	function stopRecording(saveToFile:boolean = true){
		setIsRecording(false);
		if(recorder){
			if(saveToFile){
				recorder.addEventListener('dataavailable', (e:BlobEvent) => {
					//let blobUrl = URL.createObjectURL(e.data);
					saveBlobToFile(e.data);
				});
			}
			recorder.stop();
			setRecorder(undefined);
		}
	}

	async function saveBlobToFile(blob:Blob){
		// For debugging
		// window.electron.invoke('saveBufferToFile', buffer);
		const buffer = Buffer.from(await blob.arrayBuffer());
		const filePath = await storeAudio(presId, buffer);
		onRecordingReceived(filePath);
	}

	const videoProps = {
		minWidth: 1280,
		maxWidth: 1280,
		minHeight: 720,
		maxHeight: 720
	}
	
	/**
	 * To capture video from a source provided by desktopCapturer the constraints passed to navigator.webkitGetUserMedia 
	 * must include chromeMediaSource: 'desktop', and audio: false.
	 */
	function getVideoCaptureConstraints(sourceId:number): MediaStreamConstraints {
		return {
			audio: false,
			video: {
				mandatory: {
					chromeMediaSource: 'desktop',
					chromeMediaSourceId: sourceId,
					...videoProps
				}
			} as MediaTrackConstraints // TODO: cast to "MediaTrackConstrains, but it doesn't include mandatory property
		}
	}
	
	/**
	 * To capture both audio and video from the entire desktop the constraints passed to navigator.mediaDevices.getUserMedia 
	 * must include chromeMediaSource: 'desktop', for both audio and video, but should not include a chromeMediaSourceId constraint.
	 */
	function getAudioVideoCaptureConstraints(): MediaStreamConstraints {
		return {
			audio: {
				mandatory: {
					chromeMediaSource: 'desktop',
				}
			} as MediaTrackConstraints, // TODO: cast to "MediaTrackConstrains, but it doesn't include mandatory property
				video: {
					mandatory: {
					chromeMediaSource: 'desktop',
					...videoProps
				}
			} as MediaTrackConstraints // TODO: cast to "MediaTrackConstrains, but it doesn't include mandatory property
		}
	}
	
	function getAudioCaptureConstraints(): MediaStreamConstraints {
		return {
			audio: true, // TODO: cast to "MediaTrackConstrains, but it doesn't include mandatory property
			video: false
		}
	}

	return (<Box className={classes.container} {...boxProps}>
		<Box className={classes.iconTimerContainer}>
			<AudioRecordingIcon isRecording={isRecording} />
			<Text variant='h6'>{formatTimer(timer)}</Text>
		</Box>
		<Button
			variant='contained'
			color='secondary'
			onClick={() => {
				if (!isRecording) {
					startRecording();
				} else {
					stopRecording();
				}
			}}
		>
			{t(isRecording ? 'stopRecording' : 'startRecording')}
		</Button>
	</Box>);
};

export default AudioRecorder;
