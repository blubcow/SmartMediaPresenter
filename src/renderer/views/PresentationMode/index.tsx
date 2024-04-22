import React, { useState, useEffect } from 'react';
import { usePresentationMode } from '../../hooks/useMainProcessMethods';
import { Box, Text, Button } from '../../smpUI/components';
import { FullScreen, FullScreenHandle } from 'react-full-screen';
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
	startingSlide: number;
}

const PresentationMode: React.FC<IPresenttionModeProps> = (props) => {
	const { handle, presentation, startingSlide } = props;

	// TODO: Implement the correctly working closing functionality
	const onFullscreenChange = (state: boolean, handle: FullScreenHandle) => {
		//console.log('onFullscreenChange, state is '+state);
	}

	return (
		<FullScreen handle={handle} onChange={onFullscreenChange}>
			{handle.active && (
				<Content
					presentation={presentation}
					handle={handle}
					startingSlide={startingSlide}
				/>
			)}
		</FullScreen>
	);
};

const Content = ({
	presentation,
	handle,
	startingSlide,
}: {
	presentation: SinglePresentation;
	handle: any;
	startingSlide: number;
}) => {
	const {
		slideNumber,
		nextSlide,
		previousSlide,
		quickJump,
		terminatePresentationMode,
	} = usePresentationMode(startingSlide);
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
	const [quickJumpValue, setQuickJumpValue] = useState<number | undefined>();

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
		backgroundAudio.onerror = () => {
			if (
				presentation.theme?.audio?.local &&
				presentation.theme?.audio?.remote &&
				backgroundAudio.src !== presentation.theme.audio.remote
			)
				backgroundAudio.src = presentation.theme.audio.remote;
		};
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

		// TODO: Another way to listen to full screen change - delete
		/*document.fullscreenElement!.addEventListener("fullscreenchange", () => {
			terminatePresentationMode();
			setQuickJumpValue(undefined);
		});*/

		const handleKey = (e: KeyboardEvent) => {
			e.preventDefault();
			switch (e.key) {
				case ' ':
					terminatePresentationMode();
					setQuickJumpValue(undefined);
					break;
				case 'Escape':
					terminatePresentationMode();
					setQuickJumpValue(undefined);
					break;
				case 'ArrowLeft':
					triggerBack();
					setQuickJumpValue(undefined);
					break;
				case 'ArrowRight':
					triggerNext();
					setQuickJumpValue(undefined);
					break;
				case ' ':
					setAutoPlayback((curr) => !curr);
					setQuickJumpValue(undefined);
					break;
				case '1':
				case '2':
				case '3':
				case '4':
				case '5':
				case '6':
				case '7':
				case '8':
				case '9':
				case '0':
					setQuickJumpValue((curr) => parseInt(`${curr ?? ''}${e.key}`));
					break;
				case 'Enter':
					if (quickJumpValue !== undefined) {
						const val =
							Math.max(
								0,
								Math.min(quickJumpValue - 1, presentation.slides.length - 1)
							) - slideNumber;
						quickJump(val);
					}

					setQuickJumpValue(undefined);
					break;
				case 'Backspace':
					setQuickJumpValue(undefined);
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
