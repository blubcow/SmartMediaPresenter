import React, { useState } from 'react';
import EditingButton from './EditingButton';
import { RestartAlt } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';
import EditButtonLabel from './EditButtonLabel';
import {
	getEmptySlide,
	MediaRessource,
} from '../../../shared/types/presentation';
import usePresentationEditingContext from '../../../hooks/usePresentationEditingContext';
import ActionConfirmationModal from '../modals/ActionConfirmationModal';
import { PresentationEditingActionIdentifiers } from '../../../types/identifiers';

interface IResetSettingsButtonProps {}

const ResetSettingsButton: React.FC<IResetSettingsButtonProps> = (props) => {
	const { state, dispatch } = usePresentationEditingContext();
	const { presentation, currentSlide, activeMedia } = state;
	const mediaResource: MediaRessource =
		presentation.slides[currentSlide].media[activeMedia ?? 0];
	const [openModal, setOpenModal] = useState<boolean>(false);
	const { t } = useTranslation([i18nNamespace.Presentation]);
	return (
		<>
			<EditingButton
				selected={openModal}
				icon={
					<RestartAlt
						sx={{ color: 'text.primary', height: '100%', width: '100%' }}
					/>
				}
				secondaryNode={<EditButtonLabel>{t('reset')}</EditButtonLabel>}
				onClick={() => {
					setOpenModal(true);
				}}
				{...props}
			/>
			<ActionConfirmationModal
				open={openModal}
				secondaryText={t('resetConfirmation')}
				onConfirm={() => {
					const newPresentation = JSON.parse(JSON.stringify(presentation));
					const oldSlide = JSON.parse(
						JSON.stringify(state.initialSlides[currentSlide] ?? getEmptySlide())
					);

					newPresentation.slides[currentSlide] = oldSlide;

					dispatch({
						type: PresentationEditingActionIdentifiers.presentationSettingsUpdated,
						payload: { presentation: newPresentation },
					});
					setOpenModal(false);
				}}
				onCancel={() => setOpenModal(false)}
			/>
		</>
	);
};

export default ResetSettingsButton;
