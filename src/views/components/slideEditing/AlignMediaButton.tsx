import React, { useState } from 'react';
import EditingButton from './EditingButton';
import { CropOriginal } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';
import EditButtonLabel from './EditButtonLabel';
import usePresentationEditingContext from '../../../hooks/usePresentationEditingContext';
import { MediaAlignment } from '../../../shared/types/presentation';
import { PresentationEditingActionIdentifiers } from '../../../types/identifiers';
import MediaAlignemntPopover from './MediaAlignmentPopover';

interface IAlignMediaButtonProps {}

const AlignMediaButton: React.FC<IAlignMediaButtonProps> = (props) => {
	const { t } = useTranslation([i18nNamespace.Presentation]);
	const { state, dispatch } = usePresentationEditingContext();
	const { presentation, currentSlide, activeMedia } = state;
	const [anchorElement, setAnchorElement] = useState<
		HTMLDivElement | undefined
	>(undefined);

	const handleClose = () => {
		setAnchorElement(undefined);
	};

	const handleAlignment = (align: MediaAlignment) => {
		const newPresentation = JSON.parse(JSON.stringify(presentation));
		newPresentation.slides[currentSlide].media[activeMedia!].settings = {
			...newPresentation.slides[currentSlide].media[activeMedia!].settings,
			alignment: align,
		};
		dispatch({
			type: PresentationEditingActionIdentifiers.presentationSettingsUpdated,
			payload: { presentation: newPresentation },
		});
	};

	return (
		<>
			<EditingButton
				highlighted={
					presentation.slides[currentSlide].media[activeMedia!].settings
						?.alignment !== undefined
				}
				icon={
					<CropOriginal
						sx={{ color: 'text.primary', height: '100%', width: '100%' }}
					/>
				}
				secondaryNode={<EditButtonLabel>{t('align')}</EditButtonLabel>}
				selected={!!anchorElement}
				onClick={(e) => {
					setAnchorElement(e.currentTarget);
				}}
				{...props}
			/>
			<MediaAlignemntPopover
				open={!!anchorElement}
				onClose={handleClose}
				anchorEl={anchorElement}
				alignment={
					presentation.slides[currentSlide].media[activeMedia!].settings
						?.alignment ?? presentation?.theme?.defaultMediaAlignment
				}
				handleAlignment={handleAlignment}
			/>
		</>
	);
};

export default AlignMediaButton;
