import React, { useEffect, useState } from 'react';
import { FullScreen } from 'react-full-screen';
import { Slide } from '../../../shared/types/presentation';
import { Box } from '../../../smpUI/components';

interface IPresentationFullScreenProps {
	handle: any;
	slides: Slide[];
}

const PresentationFullScreen: React.FC<IPresentationFullScreenProps> = (
	props
) => {
	const { handle, slides } = props;
	const [currentSlide, setCurrentSlide] = useState<number>(0);

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
				{slides[currentSlide] &&
					slides[currentSlide].media.map((media, i) => (
						<Box
							sx={{
								maxHeight: '100%',
								maxWidth: '50%',
								width:
									media.location.local || media.location.remote
										? undefined
										: '50%',
								aspectRatio:
									media.location.local || media.location.remote
										? undefined
										: '16/9',
							}}
						>
							{media.location.local || media.location.remote ? (
								<img
									style={{
										maxHeight: `${window.innerHeight}px`,
										maxWidth: '100%',
										display: 'block',
										transform: `translate(${
											media?.settings?.transformation?.x ?? 0
										}px, ${media?.settings?.transformation?.y ?? 0}px) scale(${
											media?.settings?.scaling?.x ?? 1
										}, ${media?.settings?.scaling?.y ?? 1}) rotate(${
											media.settings?.rotation ?? 0
										}deg)`,
										filter: `brightness(${
											media.settings?.brightness ?? 100
										}%) contrast(${
											media.settings?.contrast ?? 100
										}%) saturate(${
											media.settings?.saturation ?? 100
										}%) grayscale(${media.settings?.grayScale ?? 0}%) sepia(${
											media.settings?.sepia ?? 0
										}%) hue-rotate(${media.settings?.hue ?? 0}deg) blur(${
											media.settings?.blur ?? 0
										}px)`,
									}}
									src={media.location.local ?? media.location.remote}
									alt='presentation-media'
								/>
							) : (
								<Box
									sx={{ height: '100%', width: '100%', bgcolor: 'divider' }}
								/>
							)}
						</Box>
					))}
			</Box>
		</FullScreen>
	);
};

export default PresentationFullScreen;
