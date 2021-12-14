import React from 'react';
import EditingButton, { IEditingButtonProps } from './EditingButton';
import { TextFields } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';
import EditButtonLabel from './EditButtonLabel';
import usePresentationEditingContext from '../../../hooks/usePresentationEditingContext';
import { PresentationEditingActionIdentifiers } from '../../../types/identifiers';
import {
	SinglePresentation,
	TextElement,
} from '../../../shared/types/presentation';
import { type } from 'os';

interface IAddTextButtonProps
	extends Omit<IEditingButtonProps, 'icon' | 'secondaryNode'> {}

const AddTextButton: React.FC<IAddTextButtonProps> = (props) => {
	const { state, dispatch } = usePresentationEditingContext();
	const { presentation, currentSlide, editingBoxDimensions, lastFont } = state;
	const { t } = useTranslation([i18nNamespace.Presentation]);

	return (
		<EditingButton
			icon={
				<TextFields
					sx={{ color: 'text.primary', height: '100%', width: '100%' }}
				/>
			}
			secondaryNode={<EditButtonLabel>{t('addTxt')}</EditButtonLabel>}
			onClick={() => {
				const elementId =
					presentation.slides[currentSlide].elements?.length ?? 0;
				const newTxtComponent: TextElement = {
					id: elementId,
					position: {
						rel: { ...editingBoxDimensions },
						x: editingBoxDimensions.width / 2,
						y: editingBoxDimensions.height / 2,
					},
					type: 'text',
					text: '',
					size: { rel: editingBoxDimensions.width, font: 24 },
					alignment: 'left',
					italic: false,
					bold: false,
					font: lastFont ?? '',
					color: '#fff',
				};
				const newPresentation: SinglePresentation = JSON.parse(
					JSON.stringify(presentation)
				);
				newPresentation.slides[currentSlide].elements = [
					...(newPresentation.slides[currentSlide].elements ?? []),
					newTxtComponent,
				];
				dispatch({
					type: PresentationEditingActionIdentifiers.presentationSettingsUpdated,
					payload: {
						presentation: newPresentation,
					},
				});
				dispatch({
					type: PresentationEditingActionIdentifiers.editingTextStarted,
					payload: {
						activeComponent: elementId,
					},
				});
			}}
			{...props}
		/>
	);
};

export default AddTextButton;
