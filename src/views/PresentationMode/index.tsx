import React, { useState, useEffect } from 'react';
import { usePresentationMode } from '../../hooks/useMainProcessMethods';
import { Box, Text, Button } from '../../smpUI/components';
import { FullScreen } from 'react-full-screen';
import { SinglePresentation } from '../../shared/types/presentation';
import SlideBox from '../components/SlideBox';
import { Divider } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../i18n/i18n';
import useStyles from './styles';
import { formatTimer } from '../../util/Formatter';
import AutoPlaybackBar from '../components/AutoPlaybackBar';

interface IPresenttionModeProps {
	handle: any;
	presentation: SinglePresentation;
}

const PresentationMode: React.FC<IPresenttionModeProps> = (props) => {
	const { handle, presentation } = props;

	return (
		<FullScreen handle={handle}>
			{handle.active && <Content presentation={presentation} handle={handle} />}
		</FullScreen>
	);
};

const Content = ({
	presentation,
	handle,
}: {
	presentation: SinglePresentation;
	handle: any;
}) => {
	const { slideNumber, nextSlide, previousSlide, terminatePresentationMode } =
		usePresentationMode();
	const { t } = useTranslation([i18nNamespace.Presentation]);
	const [presentationTimer, setPresentationTimer] = useState<number>(0);
	const [slideTimer, setSlideTimer] = useState<number>(0);
	const [autoPlayback, setAutoPlayback] = useState<boolean>(false);
	const [
		autoPlaybackCurrentSlideTransformDuration,
		setAutoPlaybackCurrentSlideTransformDuration,
	] = useState<number>();
	const classes = useStyles();
	const [backgroundAudio] = useState<HTMLAudioElement>(
		new Audio(
			presentation.theme?.audio?.local ?? presentation.theme?.audio?.remote
		)
	);
	const [slideAudio] = useState<HTMLAudioElement>(new Audio());

	const triggerNext = () => {
		if (slideNumber < presentation.slides.length - 1) {
			nextSlide();
		}
	};

	const triggerBack = () => {
		if (slideNumber > 0) {
			previousSlide();
		}
	};

	useEffect(() => {
		backgroundAudio.loop = true;
		return () => backgroundAudio.pause();
	}, []);

	useEffect(() => {
		setPresentationTimer(0);

		const presInterval = setInterval(() => {
			setPresentationTimer((curr) => curr + 1);
		}, 1000);

		return () => {
			clearInterval(presInterval);
		};
	}, []);

	useEffect(() => {
		setSlideTimer(0);
		const slideInterval = setInterval(() => {
			setSlideTimer((curr) => curr + 1);
		}, 1000);

		return () => clearInterval(slideInterval);
	}, [slideNumber]);

	useEffect(() => {
		const handleKey = (e: KeyboardEvent) => {
			e.preventDefault();
			switch (e.key) {
				case 'Escape':
					terminatePresentationMode();
					break;
				case 'ArrowLeft':
					triggerBack();
					break;
				case 'ArrowRight':
					triggerNext();
					break;
				case ' ':
					setAutoPlayback((curr) => !curr);
					break;
				default:
					break;
			}
		};
		document.addEventListener('keydown', handleKey);
		return () => {
			document.removeEventListener('keydown', handleKey);
		};
	});

	useEffect(() => {
		if (!autoPlayback) return;

		const slide = presentation.slides[slideNumber];

		const audioSrc =
			slide.audio?.location.local ?? slide.audio?.location.remote;
		const timeout =
			slide.playback ?? presentation.theme?.defaultPlaybackDuration;

		if (audioSrc) {
			slideAudio.src = audioSrc;
			const getAudioDuration = () => {
				if (slideAudio.duration !== Infinity) {
					setAutoPlaybackCurrentSlideTransformDuration(
						slideAudio.duration - slideAudio.currentTime
					);
				}
			};

			slideAudio.addEventListener('durationchange', getAudioDuration);
			slideAudio.play();

			if (timeout === 'audio') {
				slideAudio.onended = triggerNext;
				return () => {
					slideAudio.pause();
					setAutoPlaybackCurrentSlideTransformDuration(undefined);
					slideAudio.removeEventListener('durationchange', getAudioDuration);
				};
			}
		}

		if (timeout === undefined)
			return () => {
				setAutoPlaybackCurrentSlideTransformDuration(undefined);
				slideAudio.pause();
			};

		setAutoPlaybackCurrentSlideTransformDuration(timeout as number);
		const handleNextSlide = setTimeout(() => {
			triggerNext();
		}, (timeout as number) * 1000);

		return () => {
			clearTimeout(handleNextSlide);
			setAutoPlaybackCurrentSlideTransformDuration(undefined);
			slideAudio.pause();
		};
	}, [autoPlayback, slideNumber]);

	useEffect(() => {
		if (autoPlayback) backgroundAudio.play();
		else backgroundAudio.pause();
	}, [autoPlayback]);

	useEffect(() => {
		backgroundAudio.pause();
		backgroundAudio.currentTime = 0;
		slideAudio.pause();
		slideAudio.currentTime = 0;
	}, [handle.active]);

	return (
		<Box className={classes.container}>
			<Box className={classes.upperBox}>
				<Box className={classes.upperLeftBox}>
					<AutoPlaybackBar
						slideTime={autoPlaybackCurrentSlideTransformDuration}
						slideNumber={slideNumber}
					/>
					<SlideBox
						slide={presentation.slides[slideNumber]}
						presentationFrameEditingEnabled={false}
						theme={{ ...presentation.theme }}
					/>
					<Box className={classes.spacer} />
					<Box className={classes.controlsContainer}>
						<Button
							variant='contained'
							onClick={() => {
								if (slideNumber > 0) previousSlide();
							}}
						>
							{t('back')}
						</Button>
						<Box className={classes.slideCounterContainer}>
							<Text variant='h6'>{`${t('slide')} ${slideNumber + 1} ${t(
								'of'
							)} ${presentation.slides.length} ${t('slides')}`}</Text>
						</Box>
						<Button
							variant='contained'
							onClick={() => {
								if (slideNumber < presentation.slides.length - 1) nextSlide();
							}}
						>
							{t('next')}
						</Button>
					</Box>
				</Box>
				<Divider orientation='vertical' />
				<Box className={classes.upperRightBox}>
					<Box className={classes.timerContainer}>
						<Text variant='h5'>{t('presentationTime')}</Text>
						<Text variant='h4'>{formatTimer(presentationTimer)}</Text>
					</Box>
					<Box className={classes.spacer} />
					<Box className={classes.timerContainer}>
						<Text variant='h5'>{t('slideTime')}</Text>
						<Text variant='h4'>{formatTimer(slideTimer)}</Text>
					</Box>
				</Box>
			</Box>
			<Divider orientation='horizontal' />
			<Box className={classes.lowerBox}>
				<Text variant='h6'>{t('notes')}</Text>
				<Divider orientation='horizontal' />
				<Box className={classes.notesContainer}>
					<Text className={classes.notes}>
						{presentation.slides[slideNumber].settings?.notes}
					</Text>
				</Box>
			</Box>
		</Box>
	);
};

export default PresentationMode;
