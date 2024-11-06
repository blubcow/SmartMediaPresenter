import React from 'react';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';
import usePresentationEditingContext from '../../../hooks/usePresentationEditingContext';
import { PresentationEditingActionIdentifiers } from '../../../types/identifiers';
import ColorPickerButton from './ColorPickerButton';
import { TextElement } from '../../../shared/types/presentation';

interface IChangeTextColorButtonProps {}

const ChangeTextColorButton: React.FC<IChangeTextColorButtonProps> = (
	props
) => {
	const { state, dispatch } = usePresentationEditingContext();
	const { presentation, currentSlide, activeComponent } = state;
	const textColor =
		(
			presentation.slides[currentSlide].elements![
				activeComponent!
			] as TextElement
		).color ?? '#fff';
	const { t } = useTranslation([i18nNamespace.Presentation]);
	return (
		<ColorPickerButton
			label={t('changeTextColor')}
			color={textColor}
			onColorPicked={(color) => {
				let newPresentation = JSON.parse(JSON.stringify(presentation));
				newPresentation.slides[currentSlide].elements[activeComponent!].color =
					color;

				dispatch({
					type: PresentationEditingActionIdentifiers.presentationSettingsUpdated,
					payload: { presentation: newPresentation },
				});
			}}
		/>
	);
};

export default ChangeTextColorButton;
