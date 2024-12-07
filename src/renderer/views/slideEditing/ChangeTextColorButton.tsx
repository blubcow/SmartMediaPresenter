import React from 'react';
import { useTranslation } from 'react-i18next';
import { usePresentationEditingContext } from '../../hooks';
import { i18nNamespace } from '../../i18n/i18n';
import { PresentationEditingActionIdentifiers } from '../../shared/identifiers.enum';
import { TextElement } from '../../shared/presentation.interface';
import ColorPickerButton from './ColorPickerButton';

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
