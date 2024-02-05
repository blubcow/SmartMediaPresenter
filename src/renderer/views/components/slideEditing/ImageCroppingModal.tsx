import React, { useState } from 'react';
import { Modal, Box, Button } from '../../../smpUI/components';
import { IModalProps } from '../../../smpUI/components/Modal';
import CroppableImage from './CroppableImage';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';
import { MediaCrop } from '../../../shared/types/presentation';
import usePresentationEditingContext from '../../../hooks/usePresentationEditingContext';
import { PresentationEditingActionIdentifiers } from '../../../types/identifiers';

interface IIMageCroppingModalProps extends IModalProps {
	close: () => void;
}

const ImageCroppingModal: React.FC<IIMageCroppingModalProps> = (props) => {
	const { close, ...modalProps } = props;
	const { t } = useTranslation([i18nNamespace.Presentation]);
	const { state, dispatch } = usePresentationEditingContext();
	const { presentation, currentSlide, activeMedia } = state;
	const [crop, setCrop] = useState<MediaCrop>();

	return (
		<Modal {...modalProps}>
			<Box sx={{ width: '500px' }}>
				<CroppableImage
					mediaElement={presentation.slides[currentSlide].media[activeMedia!]}
					onCropChanged={(crop) => setCrop(crop)}
				/>
			</Box>
			<Box
				sx={{ display: 'flex', paddingTop: 2, justifyContent: 'space-between' }}
			>
				<Button variant='contained' color='secondary' onClick={() => close()}>
					{t('cancel')}
				</Button>
				<Button
					variant='contained'
					onClick={() => {
						const newPresentation = JSON.parse(JSON.stringify(presentation));
						newPresentation.slides[currentSlide].media[
							activeMedia ?? 0
						].settings = {
							...newPresentation.slides[currentSlide].media[activeMedia ?? 0]
								.settings,
							crop: crop,
						};
						dispatch({
							type: PresentationEditingActionIdentifiers.presentationSettingsUpdated,
							payload: { presentation: newPresentation },
						});
						close();
					}}
				>
					{t('confirm')}
				</Button>
			</Box>
		</Modal>
	);
};

export default ImageCroppingModal;
