import React from 'react';
import { usePresentationEditingContext } from '../../hooks';
import { PresentationEditingActionIdentifiers } from '../../shared/identifiers.enum';
import RemoveButton from './RemoveButton';

const RemoveMediaButton: React.FC<{}> = (props) => {
	const { state, dispatch } = usePresentationEditingContext();
	const { presentation, currentSlide, activeMedia } = state;

	return (
		<RemoveButton
			onClick={() => {
				if (activeMedia === undefined) return;
				const newPresentation = JSON.parse(JSON.stringify(presentation));

				newPresentation.slides[currentSlide].media[activeMedia] = {
					id: activeMedia,
					location: {},
				};

				dispatch({
					type: PresentationEditingActionIdentifiers.presentationSettingsUpdated,
					payload: { presentation: newPresentation },
				});
				dispatch({
					type: PresentationEditingActionIdentifiers.editingSlideStated,
				});
			}}
			selected={false}
		/>
	);
};

export default RemoveMediaButton;
