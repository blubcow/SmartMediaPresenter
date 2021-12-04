import React, { useState } from 'react';
import usePresentationEditingContext from '../../../../hooks/usePresentationEditingContext';
import { Box } from '../../../../smpUI/components';
import { PresentationEditingActionIdentifiers } from '../../../../types/identifiers';
import AudioRecorder from '../../AudioRecorder';

interface IRecordAudioContentProps {}

const RecordAudioContent: React.FC<IRecordAudioContentProps> = (props) => {
	const { state, dispatch } = usePresentationEditingContext();
	const { presentationId, presentation, currentSlide } = state;

	//TODO: fix remove audio also removes playback time bug

	return (
		<Box sx={{ padding: 2 }}>
			<AudioRecorder
				presId={presentationId}
				onRecordingReceived={(path) => {
					const newPresentation = { ...presentation };
					newPresentation.slides[currentSlide].audio = {
						location: { local: 'file:///' + path },
					};
					newPresentation.slides[currentSlide].playback = 'audio';
					dispatch({
						type: PresentationEditingActionIdentifiers.presentationSettingsUpdated,
						payload: { presentation: newPresentation },
					});
				}}
			/>
		</Box>
	);
};

export default RecordAudioContent;
