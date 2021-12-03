import React, { useState, useEffect } from 'react';
import usePresentationEditingContext from '../../../../hooks/usePresentationEditingContext';
import { Box, Button, Text, IconButton } from '../../../../smpUI/components';
import AudioIcon from '../../AnimatedIcon/AudioIcon';
import { PauseCircle, PlayCircle } from '@mui/icons-material';
import { formatTimer } from '../../../../util/Formatter';
import { LinearProgress } from '@mui/material';
import { useAudioPlaybackContentStyles } from './styles';

interface IAudioPlaybackContentProps {}

const AudioPlaybackContent: React.FC<IAudioPlaybackContentProps> = (props) => {
	const { state } = usePresentationEditingContext();
	const { presentation, currentSlide } = state;
	const classes = useAudioPlaybackContentStyles();

	const audioRessource = presentation.slides[currentSlide].audio;
	const audioLocation = (audioRessource?.location.local ??
		audioRessource?.location.remote)!;

	const [audio] = useState<HTMLAudioElement>(new Audio(audioLocation));
	const [duration, setDuration] = useState<number>(0);
	const [timer, setTimer] = useState<number>(0);
	const [isPlaying, setIsPlaying] = useState<boolean>(false);

	useEffect(() => {
		const a = new Audio(audio.src);
		a.currentTime = 1;
		const getDuration = () => {
			if (a.duration !== Infinity) {
				setDuration(Math.floor(a.duration) * 100);
			}
		};

		audio.onended = () => {
			audio.currentTime = 0;
			setIsPlaying(false);
		};

		a.addEventListener('durationchange', getDuration);
		return () => a.removeEventListener('durationchange', getDuration);
	}, [audio]);

	useEffect(() => {
		if (!isPlaying) return;

		const timer = setInterval(() => {
			setTimer((curr) => curr + 1);
		}, 10);

		return () => clearInterval(timer);
	}, [isPlaying]);

	useEffect(() => {
		return () => {
			audio.pause();
			audio.currentTime = 0;
		};
	}, []);

	return (
		<Box className={classes.container}>
			<Box className={classes.upperContainer}>
				<AudioIcon isPlaying={isPlaying} />
				<Box className={classes.removeBtnContainer}>
					<Button variant='contained'>remove audio</Button>
				</Box>
			</Box>
			<Box className={classes.lowerContainer}>
				{duration > 0 && (
					<Box className={classes.lowerContent}>
						<Box className={classes.playBtnContainer}>
							<IconButton
								icon={!isPlaying ? PlayCircle : PauseCircle}
								onClick={() => {
									if (isPlaying) {
										audio.pause();
									} else {
										audio.play();
									}
									setIsPlaying((curr) => !curr);
								}}
							/>
						</Box>
						<Box className={classes.timerContainer}>
							<Text>{formatTimer(Math.floor(audio.currentTime))}</Text>
						</Box>
						<Box sx={{ padding: 1 }}>
							<LinearProgress
								sx={{ minWidth: '250px' }}
								variant='determinate'
								value={(audio.currentTime / audio.duration) * 100}
							/>
						</Box>
						<Box className={classes.timerContainer}>
							<Text>{formatTimer(Math.floor(duration / 100))}</Text>
						</Box>
					</Box>
				)}
			</Box>
		</Box>
	);
};

export default AudioPlaybackContent;
