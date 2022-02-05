import { initial } from 'lodash';
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
	initialSlide?: number;
}

const PresentationFullScreen: React.FC<IPresentationFullScreenProps> = (
	props
) => {
	const { handle, presentation, initialSlide } = props;
	return (
		<FullScreen handle={handle}>
			{handle.active && (
				<Content presentation={presentation} initialSlide={initialSlide} />
			)}
		</FullScreen>
	);
};

interface IContentProps {
	presentation: SinglePresentation;
	initialSlide?: number;
}

const Content: React.FC<IContentProps> = (props) => {
	const { presentation, initialSlide } = props;

	const [currentSlide, setCurrentSlide] = useState<number>(initialSlide ?? 0);
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
		setCurrentSlide(initialSlide ?? 0);
	}, [initialSlide]);

	useEffect(() => {
		if (presentationBoxRef.current !== undefined)
			sizeObserver.observe(presentationBoxRef.current);
	}, [presentationBoxRef.current]);

	useEffect(() => {
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
	}, [presentation.slides]);

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
		return () => {
			backgroundAudio.pause();
			slideAudio.pause();
		};
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
			slideAudio.onerror = () => {
				if (
					slide.audio?.location.local &&
					slide.audio?.location.remote &&
					audioSrc !== slide.audio.location.remote
				)
					slideAudio.src = slide.audio.location.remote;
			};
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

	return (
		<Box
			ref={presentationBoxRef}
			sx={{
				// height: `${window.innerHeight}px`,
				height: '100%',
				width: '100vw',
				position: 'relative',
			}}
		>
			{presentation.slides.map((slide) => (
				<Box
					sx={{
						position: 'absolute',
						opacity: slide.id === currentSlide ? 1 : 0,
						top: 0,
						left: 0,
						height: '100%',
						width: '100%',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						bgcolor: slide.settings?.color ?? '#000',
					}}
				>
					<SlideBox
						slide={slide}
						theme={{ ...presentation.theme }}
						presentationFrameEditingEnabled={false}
					/>
				</Box>
			))}
		</Box>
	);
};

export default PresentationFullScreen;
