import { useEffect, useState } from "react";


const useMediaStreamRecorder = () => {

    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [recorder, setRecorder] = useState<MediaRecorder>();

    // On dismount, stop recording without saving file
	useEffect(() => {
		return function cleanup(){
			if (isRecording) stopRecording();
		};
	}, []);

    const startRecording = async() => {
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

	const stopRecording = ():Promise<Blob> => {
		setIsRecording(false);
        const blobPromise = new Promise<Blob>((resolve, reject) => {
            if(recorder){
                recorder.addEventListener('dataavailable', (e:BlobEvent) => {
                    resolve(e.data);
				});
                recorder.stop();
                setRecorder(undefined);
            }
        });
        return blobPromise;
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
	
    // Added constraints from https://blog.addpipe.com/audio-constraints-getusermedia/
	function getAudioCaptureConstraints(): MediaStreamConstraints {
		return {
            /*
            audio: {
                sampleRate: 48000,
                googAutoGainControl: true,
                echoCancellation: true,
                autoGainControl: true,
                noiseSuppression: true
            } as MediaTrackConstraints, // TODO: cast to "MediaTrackConstrains, but it doesn't include mandatory property,
            */
            audio: {
                sampleRate: 48000
            } as MediaTrackConstraints, // TODO: cast to "MediaTrackConstrains, but it doesn't include mandatory property,
			video: false
		}
	}

	return {
        isRecording,
        startRecording,
        stopRecording
	};
};

export default useMediaStreamRecorder;
