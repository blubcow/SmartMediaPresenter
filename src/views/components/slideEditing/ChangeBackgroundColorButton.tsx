import React from 'react';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';
import usePresentationEditingContext from '../../../hooks/usePresentationEditingContext';
import { PresentationEditingActionIdentifiers } from '../../../types/identifiers';
import ColorPickerButton from './ColorPickerButton';

interface IChangeBackgroundColorButtonProps {}

const ChangeBackgroundColorButton: React.FC<IChangeBackgroundColorButtonProps> =
	(props) => {
		const { state, dispatch } = usePresentationEditingContext();
		const { presentation, currentSlide } = state;
		const backgroundColor =
			presentation.slides[currentSlide].settings?.color ?? '#000';

		const { t } = useTranslation([i18nNamespace.Presentation]);
		return (
			<ColorPickerButton
				label={t('changeSlideColor')}
				color={backgroundColor}
				onColorPicked={(color) => {
					let newPresentation = { ...presentation };
					newPresentation.slides = [...presentation.slides];
					newPresentation.slides[currentSlide] = {
						...presentation.slides[currentSlide],
						settings: {
							...presentation.slides[currentSlide].settings,
							color: color,
						},
					};

					dispatch({
						type: PresentationEditingActionIdentifiers.presentationSettingsUpdated,
						payload: { presentation: newPresentation },
					});
				}}
			/>
		);
	};

export default ChangeBackgroundColorButton;
