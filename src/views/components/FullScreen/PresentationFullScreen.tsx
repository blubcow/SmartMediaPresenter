import React, { useEffect, useState, useRef } from 'react';
import { FullScreen } from 'react-full-screen';
import { Dimensions, Slide } from '../../../shared/types/presentation';
import { Box } from '../../../smpUI/components';
import SlideBox from '../SlideBox';

interface IPresentationFullScreenProps {
	handle: any;
	slides: Slide[];
}

const PresentationFullScreen: React.FC<IPresentationFullScreenProps> = (
	props
) => {
	const { handle, slides } = props;
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
	const [t, st] = useState<string>('');

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
						Math.min(current + 1, slides.length - 1)
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
	}, [slides, handle.active]);

	useEffect(() => {
		if (!autoSliding) return;

		const slide = slides[currentSlide];

		const audioSrc =
			slide.audio?.location.local ?? slide.audio?.location.remote;
		const timeout = slide.playback;
		const audio = new Audio();

		if (audioSrc) {
			audio.src = audioSrc;
			audio.play();
			if (timeout === 'audio') {
				audio.onended = () =>
					setCurrentSlide((current) =>
						Math.min(current + 1, slides.length - 1)
					);
				return () => {
					audio.pause();
				};
			}
		}

		if (timeout === undefined) return () => audio.pause();

		const handleNextSlide = setTimeout(() => {
			audio.pause();
			setCurrentSlide((current) => Math.min(current + 1, slides.length - 1));
		}, (timeout as number) * 1000);

		return () => clearTimeout(handleNextSlide);
	}, [autoSliding, currentSlide]);

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
					bgcolor: slides[currentSlide]
						? slides[currentSlide].settings?.color ?? '#000'
						: '#000',
				}}
			>
				<SlideBox
					slide={slides[currentSlide]}
					presentationFrameEditingEnabled={false}
				/>
			</Box>
		</FullScreen>
	);
};

export default PresentationFullScreen;
