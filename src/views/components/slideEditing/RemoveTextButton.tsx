import React, { useEffect } from 'react';
import usePresentationEditingContext from '../../../hooks/usePresentationEditingContext';
import { SinglePresentation } from '../../../shared/types/presentation';
import { PresentationEditingActionIdentifiers } from '../../../types/identifiers';
import RemoveButton from './RemoveButton';

const RemoveTextButton: React.FC<{}> = (props) => {
	const { state, dispatch } = usePresentationEditingContext();
	const { presentation, currentSlide, activeComponent = 0 } = state;

	return (
		<RemoveButton
			selected={false}
			onClick={() => {
				const newPresentation: SinglePresentation = JSON.parse(
					JSON.stringify(presentation)
				);

				newPresentation.slides[currentSlide].elements =
					newPresentation.slides[currentSlide].elements
						?.filter((element) => element.id !== activeComponent)
						.map((element) => ({
							...element,
							id: element.id > activeComponent ? element.id - 1 : element.id,
						})) ?? undefined;
				dispatch({
					type: PresentationEditingActionIdentifiers.editingSlideStated,
				});
				dispatch({
					type: PresentationEditingActionIdentifiers.presentationSettingsUpdated,
					payload: { presentation: newPresentation },
				});
			}}
		/>
	);
};

export default RemoveTextButton;
