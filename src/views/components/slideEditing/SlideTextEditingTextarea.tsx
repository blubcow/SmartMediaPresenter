import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import usePresentationEditingContext from '../../../hooks/usePresentationEditingContext';
import { Dimensions, TextElement } from '../../../shared/types/presentation';
import { PresentationEditingActionIdentifiers } from '../../../types/identifiers';

interface ISlideTextEditingTextareaProps {
	elementId: number;
	parentSize: Dimensions;
	editableStyle: React.CSSProperties;
}

const SlideTextEditingTextarea: React.FC<ISlideTextEditingTextareaProps> = (
	props
) => {
	const { elementId, parentSize, editableStyle } = props;
	const { state, dispatch } = usePresentationEditingContext();
	const { presentation, currentSlide, activeComponent } = state;
	const textElement = presentation.slides[currentSlide].elements![
		elementId
	] as TextElement;
	const textareaRef = useRef<any>();

	const [editableText, setEditableText] = useState<string>(textElement.text);

	const resizeTextarea = () => {
		textareaRef.current.style.height = '0px';
		textareaRef.current.style.width = '0px';

		const scrollHeight = textareaRef.current.scrollHeight;
		const scrollWidth = textareaRef.current.scrollWidth;

		textareaRef.current.style.height = scrollHeight + 'px';
		textareaRef.current.style.width = scrollWidth + 'px';
	};

	useEffect(() => {
		resizeTextarea();

		if (elementId === activeComponent) {
			const debounceDispatchText = setTimeout(() => {
				const newPresentation = JSON.parse(JSON.stringify(presentation));

				newPresentation.slides[currentSlide].elements![elementId].text =
					editableText;

				dispatch({
					type: PresentationEditingActionIdentifiers.presentationSettingsUpdated,
					payload: { presentation: newPresentation },
				});
			}, 1000);

			return () => {
				clearTimeout(debounceDispatchText);
			};
		}
	}, [editableText, state.presentation, textareaRef.current]);

	useLayoutEffect(() => {
		const initialResize = setTimeout(() => {
			resizeTextarea();
		}, 5);
		return () => clearTimeout(initialResize);
	}, [textareaRef.current]);

	return (
		<textarea
			ref={textareaRef}
			value={editableText}
			onChange={(e) => setEditableText(e.currentTarget.value)}
			placeholder={'type here'}
			onClick={(e) => {
				e.stopPropagation();
				dispatch({
					type: PresentationEditingActionIdentifiers.editingTextStarted,
					payload: { activeComponent: elementId },
				});
			}}
			style={{
				...editableStyle,
				resize: 'none',
				background: 'transparent',
				outline: activeComponent === elementId ? '2px dashed white' : 'none',
				border: 'none',
			}}
		/>
	);
};

export default SlideTextEditingTextarea;
