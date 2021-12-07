import React from 'react';
import usePresentationEditingContext from '../../../hooks/usePresentationEditingContext';
import { getEmptySlide, Slide } from '../../../shared/types/presentation';
import { PresentationEditingActionIdentifiers } from '../../../types/identifiers';
import RemoveButton from './RemoveButton';

const RemoveMediaButton: React.FC<{}> = (props) => {
	const { state, dispatch } = usePresentationEditingContext();
	const { presentation, currentSlide, activeMedia } = state;

	return (
		<RemoveButton
			onClick={() => {
				if (activeMedia === undefined) return;
				const newPresentation = { ...presentation };
				const slide = presentation.slides[currentSlide];

				newPresentation.slides[currentSlide].media[activeMedia] = {
					id: activeMedia,
					location: {},
				};

				dispatch({
					type: PresentationEditingActionIdentifiers.presentationSettingsUpdated,
					payload: { presentation: newPresentation },
				});
			}}
			selected={false}
		/>
	);
};

export default RemoveMediaButton;
