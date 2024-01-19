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

interface IColorTransferButtonProps { }

const ColorTransferButton: React.FC<IColorTransferButtonProps> = (props) => {
	const { t } = useTranslation([i18nNamespace.Presentation]);
	const [anchorElement, setAnchorElement] = useState<HTMLDivElement | undefined>(undefined);

	const { state, dispatch } = usePresentationEditingContext();
	const { presentation, currentSlide, activeMedia } = state;

	const handleClose = () => {
		setAnchorElement(undefined);
	};

	const handleAlignment = (align: MediaAlignment) => {
		/*
		const newPresentation = JSON.parse(JSON.stringify(presentation));
		newPresentation.slides[currentSlide].media[activeMedia!].settings = {
			...newPresentation.slides[currentSlide].media[activeMedia!].settings,
			alignment: align,
		};
		dispatch({
			type: PresentationEditingActionIdentifiers.presentationSettingsUpdated,
			payload: { presentation: newPresentation },
		});
		*/
	};

	const onEditButtonClicked = async (e:React.MouseEvent<HTMLDivElement>) => {
		console.log(presentation);

		const sourceMediaIdx:number = activeMedia! == 0 ? 1 : 0; // The color source
		const targetMediaIdx:number = activeMedia!; // The image to transform

		let tmpImgPath = await window.electron.invoke('pythontest',
			presentation.slides[currentSlide].media[sourceMediaIdx!].location.local!.replace('file://',''),
			presentation.slides[currentSlide].media[targetMediaIdx!].location.local!.replace('file://',''),
		);

		// Need to always have the latest version!
		tmpImgPath = tmpImgPath + '?time=' + (new Date()).getTime();

		setAnchorElement(e.currentTarget);

		const newPresentation = JSON.parse(JSON.stringify(presentation));
		newPresentation.slides[currentSlide].media[activeMedia!].location.local = tmpImgPath;
		dispatch({
			type: PresentationEditingActionIdentifiers.presentationSettingsUpdated,
			payload: { presentation: newPresentation },
		});

		// TODO: when the change is reverted, the image info is lost (The info is not dispatched, the presentation is not updated)
	}

	return (
		<>
			<EditingButton
				highlighted={
					presentation.slides[currentSlide].media[activeMedia!].settings?.alignment !== undefined
				}
				icon={
					<CropOriginal sx={{ color: 'text.primary', height: '100%', width: '100%' }} />
				}
				secondaryNode={
					<EditButtonLabel>{t('colortransfer')}</EditButtonLabel>
				}
				selected={!!anchorElement}
				onClick={onEditButtonClicked}
				{...props}
			/>
			{/*<MediaAlignemntPopover
				open={!!anchorElement}
				onClose={handleClose}
				anchorEl={anchorElement}
				alignment={
					presentation.slides[currentSlide].media[activeMedia!].settings
						?.alignment ?? presentation?.theme?.defaultMediaAlignment
				}
				handleAlignment={handleAlignment}
			/>*/}
		</>
	);
};

export default ColorTransferButton;
