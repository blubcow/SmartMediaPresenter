import React, { useState, useEffect } from 'react';
import { Box } from '../../smpUI/components';
import { usePresentationMode } from '../../hooks/useMainProcessMethods';
import { useLocation } from 'react-router-dom';
import { useSinglePresentation } from '../../hooks/useMainProcessMethods';
import SlideBox from '../components/SlideBox';
import usePresentationCacheContext from '../../hooks/usePresentationCacheContext';
import usePresentationSyncContext from '../../hooks/usePresentationSyncContext';
import { SinglePresentation } from '../../shared/types/presentation';
import { CircularProgress } from '@mui/material';

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
	const [remoteId, setRemoteId] = useState<string>('');
	const { storedPresentation } = useSinglePresentation(parseInt(id));
	const { changeCurrentPresentation } = usePresentationCacheContext();
	const { syncingAvailable, retrieveRemotePresentationOnce } =
		usePresentationSyncContext();
	const [loadingRemotePresentation, setLoadginRemotePresentation] =
		useState<boolean>(false);
	const [remotePresentation, setRemotePresentation] = useState<
		SinglePresentation | undefined
	>();

	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const id = params.get('id');
		setRemoteId(params.get('remoteId') ?? '');
		setId(id ?? '');
	}, [location.search]);

	useEffect(() => {
		if (remoteId !== '' && id === '' && syncingAvailable) {
			setLoadginRemotePresentation(true);
			retrieveRemotePresentationOnce(remoteId, (pres) => {
				changeCurrentPresentation(undefined, remoteId, pres);
				setRemotePresentation(pres);
				setLoadginRemotePresentation(false);
			});
		}
	}, [remoteId, syncingAvailable]);

	useEffect(() => {
		if (id !== '') {
			const intId = parseInt(id);

			if (!isNaN(intId) && storedPresentation) {
				changeCurrentPresentation(intId, remoteId, storedPresentation);
			}
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
			{loadingRemotePresentation ? (
				<CircularProgress variant='indeterminate' />
			) : (
				<>
					{storedPresentation ||
						(remotePresentation && (
							<SlideBox
								slide={
									(storedPresentation ?? remotePresentation).slides[slideNumber]
								}
								presentationFrameEditingEnabled={false}
								theme={{ ...(storedPresentation ?? remotePresentation).theme }}
							/>
						))}
				</>
			)}
		</Box>
	);
};

export default PresentationMode;
