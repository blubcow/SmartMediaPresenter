import React, { useState, useEffect } from 'react';
import { Box } from '../../smpUI/components';
import { usePresentationMode } from '../../hooks/useMainProcessMethods';
import { useLocation } from 'react-router-dom';
import { useSinglePresentation } from '../../hooks/useMainProcessMethods';
import SlideBox from '../components/SlideBox';
import usePresentationCacheContext from '../../hooks/usePresentationCacheContext';

const PresentationMode = () => {
	const location = useLocation();
	const startingSlideString = new URLSearchParams(location.search).get(
		'startingSlide'
	);
	const startingSlide = startingSlideString ? parseInt(startingSlideString) : 0;
	const { slideNumber } = usePresentationMode(
		startingSlide >= 0 ? startingSlide : 0
	);
	const [id, setId] = useState<string>('');
	const { storedPresentation } = useSinglePresentation(parseInt(id));
	const { changeCurrentPresentation } = usePresentationCacheContext();

	useEffect(() => {
		const id = new URLSearchParams(location.search).get('id');
		setId(id ?? '');
	}, [location.search]);

	useEffect(() => {
		const intId = parseInt(id);

		if (!isNaN(intId) && storedPresentation) {
			changeCurrentPresentation(intId, storedPresentation);
		}
	}, [storedPresentation]);

	return (
		<Box
			sx={{
				height: '100vh',
				width: '100vw',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			{storedPresentation && (
				<SlideBox
					slide={storedPresentation.slides[slideNumber]}
					presentationFrameEditingEnabled={false}
					theme={{ ...storedPresentation.theme }}
				/>
			)}
		</Box>
	);
};

export default PresentationMode;
