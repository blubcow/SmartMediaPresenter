import React from 'react';
import usePresentationEditingContext from '../../../hooks/usePresentationEditingContext';
import { Box } from '@mui/material';
import { PresentationEditingActionIdentifiers } from '../../../shared/identifiers.enum';
import AudioRecorder from '../../components/AudioRecorder';

interface IRecordAudioContentProps {}

const RecordAudioContent: React.FC<IRecordAudioContentProps> = (props) => {
	const { state, dispatch } = usePresentationEditingContext();
	const { presentationId, presentation, currentSlide } = state;

	return (
		<Box sx={{ padding: 2 }}>
			<AudioRecorder
				presId={presentationId}
				onRecordingReceived={(path) => {
					const newPresentation = { ...presentation };
					newPresentation.slides = [...presentation.slides];
					newPresentation.slides[currentSlide] = {
						...presentation.slides[currentSlide],
						audio: {
							location: { local: 'file://' + path },
						},
						playback: 'audio',
					};

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
