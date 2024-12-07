import { RestartAlt } from '@mui/icons-material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePresentationEditingContext } from '../../hooks';
import { i18nNamespace } from '../../i18n/i18n';
import { PresentationEditingActionIdentifiers } from '../../shared/identifiers.enum';
import {
	getEmptySlide,
	MediaRessource,
} from '../../shared/presentation.interface';
import ActionConfirmationModal from '../modals/ActionConfirmationModal';
import { EditableCaptionText } from './EditableCaptionText';
import EditingButton from './EditingButton';

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
				secondaryNode={<EditableCaptionText>{t('reset')}</EditableCaptionText>}
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
