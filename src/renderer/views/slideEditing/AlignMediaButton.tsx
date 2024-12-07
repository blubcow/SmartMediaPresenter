import { CropOriginal } from '@mui/icons-material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePresentationEditingContext } from '../../hooks';
import { i18nNamespace } from '../../i18n/i18n';
import { PresentationEditingActionIdentifiers } from '../../shared/identifiers.enum';
import { MediaAlignment } from '../../shared/presentation.interface';
import { EditableCaptionText } from './EditableCaptionText';
import EditingButton from './EditingButton';
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
				secondaryNode={<EditableCaptionText>{t('align')}</EditableCaptionText>}
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
