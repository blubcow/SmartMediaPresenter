import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import usePresentationEditingContext from '../../../hooks/usePresentationEditingContext';
import { Dimensions, TextElement } from '../../../shared/types/presentation';
import { PresentationEditingActionIdentifiers } from '../../../types/identifiers';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';

interface ISlideTextEditingTextareaProps {
	elementId: number;
	parentSize: Dimensions;
	editableStyle: React.CSSProperties;
	heightMultiplier: number;
	widthMulitplier: number;
}

const SlideTextEditingTextarea: React.FC<ISlideTextEditingTextareaProps> = (
	props
) => {
	const {
		elementId,
		parentSize,
		editableStyle,
		heightMultiplier,
		widthMulitplier,
	} = props;
	const { state, dispatch } = usePresentationEditingContext();
	const { presentation, currentSlide, activeComponent } = state;
	const textElement = presentation.slides[currentSlide].elements![
		elementId
	] as TextElement;
	const textareaRef = useRef<any>();
	const { t } = useTranslation([i18nNamespace.Presentation]);

	const [editableText, setEditableText] = useState<string>(textElement.text);
	const [dragging, setDragging] = useState<boolean>(false);
	const [initialDraggingPosition, setInitialDraggingPosition] = useState<{
		x: number;
		y: number;
	}>({ x: 0, y: 0 });
	const [previousPosition, setPreviousPosition] = useState<{
		x: number;
		y: number;
	}>({ x: 0, y: 0 });
	const [editingPosition, setEditingPosition] = useState<{
		x: number;
		y: number;
	}>({
		x: widthMulitplier * textElement.position.x,
		y: heightMultiplier * textElement.position.y,
	});

	const resizeTextarea = () => {
		textareaRef.current.style.height = '0px';
		textareaRef.current.style.width = '0px';

		const scrollHeight = textareaRef.current.scrollHeight;
		const scrollWidth = textareaRef.current.scrollWidth;

		textareaRef.current.style.height = scrollHeight + 'px';
		textareaRef.current.style.width = scrollWidth + 'px';
	};

	useEffect(() => {
		if (!dragging) {
			const newPresentation = JSON.parse(JSON.stringify(presentation));
			newPresentation.slides[currentSlide].elements![elementId].position = {
				rel: {
					...parentSize,
				},
				...editingPosition,
			};
			dispatch({
				type: PresentationEditingActionIdentifiers.presentationSettingsUpdated,
				payload: { presentation: newPresentation },
			});
			return;
		}

		const draggingHanlder = (e: MouseEvent) => {
			setEditingPosition({
				x: previousPosition.x + e.pageX - initialDraggingPosition.x,
				y: previousPosition.y + e.pageY - initialDraggingPosition.y,
			});
		};

		const stopDraggingHandler = () => {
			setDragging(false);
		};

		document.addEventListener('mousemove', draggingHanlder);
		document.addEventListener('mouseup', stopDraggingHandler);

		return () => {
			document.removeEventListener('mousemove', draggingHanlder);
			document.removeEventListener('mouseup', stopDraggingHandler);
		};
	}, [dragging]);

	useEffect(() => {
		setEditingPosition({
			x: heightMultiplier * textElement.position.x,
			y: widthMulitplier * textElement.position.y,
		});
	}, [
		heightMultiplier,
		widthMulitplier,
		textElement.position.x,
		textElement.position.y,
	]);

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
		}, 0);
		return () => clearTimeout(initialResize);
	}, [textareaRef.current, textElement.text]);

	return (
		<textarea
			ref={textareaRef}
			value={editableText}
			onMouseDown={(e) => {
				setInitialDraggingPosition({ x: e.pageX, y: e.pageY });
				setPreviousPosition({ ...editingPosition });
				setDragging(true);
			}}
			onChange={(e) => setEditableText(e.currentTarget.value)}
			placeholder={t('typeHere')}
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
				top: editingPosition.y + 'px',
				left: editingPosition.x + 'px',
			}}
		/>
	);
};

export default SlideTextEditingTextarea;
