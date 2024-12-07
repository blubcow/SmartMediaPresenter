import { PauseCircle, PlayCircle } from '@mui/icons-material';
import { Box, Button, IconButton, LinearProgress, Theme } from '@mui/material';
import { createStyles, makeStyles } from '@mui/styles';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePresentationEditingContext } from '../../../hooks';
import { i18nNamespace } from '../../../i18n/i18n';
import { formatTimer } from '../../../shared/format.utils';
import { PresentationEditingActionIdentifiers } from '../../../shared/identifiers.enum';
import { EditableText } from '../../../smpUI';
import AudioIcon from '../../icons/AudioIcon';

export const useAudioPlaybackContentStyles = makeStyles((theme: Theme) =>
	createStyles({
		container: {
			padding: theme.spacing(2),
		},
		upperContainer: { display: 'flex', justifyContent: 'space-between' },
		removeBtnContainer: {
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
		},
		lowerContainer: {
			display: 'flex',
			justifyContent: 'center',
			paddingTop: theme.spacing(2),
		},
		lowerContent: {
			display: 'flex',
			alignItems: 'center',
		},
		playBtnContainer: {
			paddingRight: theme.spacing(1),
		},
		timerContainer: {
			display: 'flex',
			justifyContent: 'center',
			width: '60px',
		},
	})
);


interface IAudioPlaybackContentProps {}

const AudioPlaybackContent: React.FC<IAudioPlaybackContentProps> = (props) => {
	const { state, dispatch } = usePresentationEditingContext();
	const { presentation, currentSlide } = state;
	const classes = useAudioPlaybackContentStyles();
	const { t } = useTranslation([i18nNamespace.Presentation]);

	const audioRessource = presentation.slides[currentSlide].audio;
	const audioLocation = (audioRessource?.location.local ??
		audioRessource?.location.remote)!;

	const [audio] = useState<HTMLAudioElement>(new Audio(audioLocation));
	const [duration, setDuration] = useState<number>();
	const [timer, setTimer] = useState<number>(0);
	const [isPlaying, setIsPlaying] = useState<boolean>(false);

	useEffect(() => {
		audio.onerror = () => {
			if (
				audioRessource?.location.local &&
				audioRessource?.location.remote &&
				audio.src !== audioRessource.location.remote
			)
				audio.src = audioRessource.location.remote;
		};
	}, []);

	useEffect(() => {
		const a = new Audio(audio.src);
		a.currentTime = Number.MAX_SAFE_INTEGER;
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
	}, [audio, audio.src]);

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
					<Button
						variant='contained'
						onClick={() => {
							const newPresentation = { ...presentation };
							newPresentation.slides[currentSlide].audio = undefined;
							newPresentation.slides[currentSlide].playback = undefined;
							dispatch({
								type: PresentationEditingActionIdentifiers.presentationSettingsUpdated,
								payload: { presentation: newPresentation },
							});
						}}
					>
						{t('removeAudio')}
					</Button>
				</Box>
			</Box>
			<Box className={classes.lowerContainer}>
				{duration !== undefined && (
					<Box className={classes.lowerContent}>
						<Box className={classes.playBtnContainer}>
							<IconButton
								onClick={() => {
									if (isPlaying) {
										audio.pause();
									} else {
										audio.play();
									}
									setIsPlaying((curr) => !curr);
								}}
							>{ !isPlaying ? <PlayCircle/> : <PauseCircle/> }</IconButton>
						</Box>
						<Box className={classes.timerContainer}>
							<EditableText>{formatTimer(Math.floor(audio.currentTime))}</EditableText>
						</Box>
						<Box sx={{ padding: 1 }}>
							<LinearProgress
								sx={{ minWidth: '250px' }}
								variant='determinate'
								value={(audio.currentTime / audio.duration) * 100}
							/>
						</Box>
						<Box className={classes.timerContainer}>
							<EditableText>{formatTimer(Math.floor((duration ?? 0) / 100))}</EditableText>
						</Box>
					</Box>
				)}
			</Box>
		</Box>
	);
};

export default AudioPlaybackContent;
