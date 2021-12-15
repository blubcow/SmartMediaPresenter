import React, { useEffect, useState, useRef } from 'react';
import { FullScreen } from 'react-full-screen';
import {
	Dimensions,
	SinglePresentation,
} from '../../../shared/types/presentation';
import { Box } from '../../../smpUI/components';
import SlideBox from '../SlideBox';

interface IPresentationFullScreenProps {
	handle: any;
	presentation: SinglePresentation;
}

const PresentationFullScreen: React.FC<IPresentationFullScreenProps> = (
	props
) => {
	const { handle, presentation } = props;
	const [currentSlide, setCurrentSlide] = useState<number>(0);
	const [presentationBoxSize, setPresentationBoxSize] = useState<Dimensions>({
		height: 0,
		width: 0,
	});
	const presentationBoxRef = useRef<any>();
	const [sizeObserver] = useState<ResizeObserver>(
		new ResizeObserver(() => {
			setPresentationBoxSize({
				height: presentationBoxRef.current?.clientHeight ?? 0,
				width: presentationBoxRef.current?.clientWidth ?? 0,
			});
		})
	);
	const [autoSliding, setAutoSliding] = useState<boolean>(false);
	const [backgroundAudio] = useState<HTMLAudioElement>(
		new Audio(
			presentation.theme?.audio?.local ?? presentation.theme?.audio?.remote
		)
	);
	const [slideAudio] = useState<HTMLAudioElement>(new Audio());

	useEffect(() => {
		if (presentationBoxRef.current !== undefined)
			sizeObserver.observe(presentationBoxRef.current);
	}, [presentationBoxRef.current]);

	useEffect(() => {
		if (!handle.active) return;

		const handleKey = (e: KeyboardEvent) => {
			switch (e.key) {
				case 'ArrowLeft':
					setCurrentSlide((current) => Math.max(0, current - 1));
					break;
				case 'ArrowRight':
					setCurrentSlide((current) =>
						Math.min(current + 1, presentation.slides.length - 1)
					);
					break;
				case ' ':
					setAutoSliding((curr) => !curr);
					break;
				default:
					break;
			}
		};
		document.addEventListener('keydown', handleKey);
		return () => {
			document.removeEventListener('keydown', handleKey);
		};
	}, [presentation.slides, handle.active]);

	useEffect(() => {
		backgroundAudio.loop = true;
	}, []);

	useEffect(() => {
		if (!autoSliding) return;

		backgroundAudio.play();

		const slide = presentation.slides[currentSlide];

		const audioSrc =
			slide.audio?.location.local ?? slide.audio?.location.remote;
		const timeout =
			slide.playback ?? presentation.theme?.defaultPlaybackDuration;

		if (audioSrc) {
			slideAudio.src = audioSrc;
			slideAudio.play();
			if (timeout === 'audio') {
				slideAudio.onended = () =>
					setCurrentSlide((current) =>
						Math.min(current + 1, presentation.slides.length - 1)
					);
				return () => {
					slideAudio.pause();
				};
			}
		}

		if (timeout === undefined)
			return () => {
				slideAudio.pause();
			};

		const handleNextSlide = setTimeout(() => {
			slideAudio.pause();
			setCurrentSlide((current) =>
				Math.min(current + 1, presentation.slides.length - 1)
			);
		}, (timeout as number) * 1000);

		return () => {
			clearTimeout(handleNextSlide);
		};
	}, [autoSliding, currentSlide]);

	useEffect(() => {
		if (autoSliding) backgroundAudio.play();
		else backgroundAudio.pause();
	}, [autoSliding]);

	useEffect(() => {
		backgroundAudio.pause();
		backgroundAudio.currentTime = 0;
		slideAudio.pause();
		slideAudio.currentTime = 0;
	}, [handle.active]);

	return (
		<FullScreen handle={handle}>
			<Box
				ref={presentationBoxRef}
				sx={{
					// height: `${window.innerHeight}px`,
					height: '100%',
					width: '100vw',
					display: handle.active ? 'flex' : 'none',
					alignItems: 'center',
					justifyContent: 'center',
					bgcolor: presentation.slides[currentSlide]
						? presentation.slides[currentSlide].settings?.color ?? '#000'
						: '#000',
				}}
			>
				<SlideBox
					slide={presentation.slides[currentSlide]}
					theme={{ ...presentation.theme }}
					presentationFrameEditingEnabled={false}
				/>
			</Box>
		</FullScreen>
	);
};

export default PresentationFullScreen;
