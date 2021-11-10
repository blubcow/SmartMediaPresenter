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
		console.log(window.innerHeight);
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
					height: `${window.innerHeight}px`,
					width: '100vw',
					display: handle.active ? 'flex' : 'none',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				{slides[currentSlide].media.map((media, i) => (
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
							overflow: 'hidden',
						}}
					>
						{media.location.local || media.location.remote ? (
							<img
								style={{
									maxHeight: `${window.innerHeight}px`,
									maxWidth: '100%',
									display: 'block',
									// transform: 'translate(0, -400px)',
								}}
								src={media.location.local ?? media.location.remote}
							/>
						) : (
							<Box sx={{ height: '100%', width: '100%', bgcolor: 'divider' }} />
						)}
					</Box>
				))}
			</Box>
		</FullScreen>
	);
};

const MediaHolder = (props: { url: string }) => {};

export default PresentationFullScreen;
