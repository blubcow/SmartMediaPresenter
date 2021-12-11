import React from 'react';
import SlideTextElement from '../SlideTextElement';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';
import usePresentationEditingContext from '../../../hooks/usePresentationEditingContext';
import { TextElement } from '../../../shared/types/presentation';
import { PresentationEditingActionIdentifiers } from '../../../types/identifiers';

interface IEditableSlideTextProps {
	elementId: number;
}

const EditableSlideText: React.FC<IEditableSlideTextProps> = (props) => {
	const { elementId } = props;
	const { state, dispatch } = usePresentationEditingContext();
	const { presentation, currentSlide, activeComponent, editingBoxDimensions } =
		state;
	const textElement: TextElement = presentation.slides[currentSlide].elements![
		elementId
	] as TextElement;
	const { t } = useTranslation([i18nNamespace.Presentation]);

	return (
		<SlideTextElement
			editable
			multiLineEditable
			placeholder={t('typeHere')}
			textElement={textElement}
			parentSize={editingBoxDimensions}
			onClick={(e) => {
				e.stopPropagation();
				dispatch({
					type: PresentationEditingActionIdentifiers.editingTextStarted,
					payload: { activeComponent: elementId },
				});
			}}
			editableStyle={{
				pointerEvents: 'initial',
				outline: activeComponent === elementId ? '2px dashed white' : 'none',
				userSelect: 'text',
			}}
		>
			{textElement.text}
		</SlideTextElement>
	);
};

export default EditableSlideText;
