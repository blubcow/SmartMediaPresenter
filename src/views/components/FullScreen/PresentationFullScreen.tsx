import React, { useEffect, useState, useRef } from 'react';
import { FullScreen } from 'react-full-screen';
import { Dimensions, Slide } from '../../../shared/types/presentation';
import { Box } from '../../../smpUI/components';
import PresentationFrame from '../PresentationFrame';
import SlideEditingBox from '../SlideEditingBox';

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
						Math.min(current + 1, slides.length - 1)
					);
					break;
				default:
					break;
			}
		};
		document.addEventListener('keydown', handleKey);
		return () => {
			document.removeEventListener('keydown', handleKey);
		};
	}, [slides]);

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
				<SlideEditingBox
					slide={slides[currentSlide]}
					presentationFrameEditingEnabled={false}
				/>
			</Box>
		</FullScreen>
	);
};

export default PresentationFullScreen;
