import React, { useEffect, useRef, useState } from 'react';
import EditingButton from './EditingButton';
import { CropOriginal } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';
import EditButtonLabel from './EditButtonLabel';
import usePresentationEditingContext from '../../../hooks/usePresentationEditingContext';
import { MediaAlignment, MediaLocation, SinglePresentation, Slide } from '../../../shared/types/presentation';
import { PresentationEditingActionIdentifiers } from '../../../types/identifiers';
import MediaAlignemntPopover from './MediaAlignmentPopover';
import ColorTransferPopover from './ColorTransferPopover';

interface IColorTransferButtonProps { }

const ColorTransferButton: React.FC<IColorTransferButtonProps> = (props) => {
	const { t } = useTranslation([i18nNamespace.Presentation]);
	const { state, dispatch } = usePresentationEditingContext();
	const { presentation, currentSlide, activeMedia, secondActiveMedia } = state;

	//const [active, setActive] = useState<boolean>(false);
	const isActive = useRef<boolean>(false);
	const originalSlide = useRef<Slide | undefined>(undefined);
	const anchorElRef = useRef(null);

	const onPopoverOpen = () => {
		originalSlide.current = presentation.slides[currentSlide];
		isActive.current = true;
		//setActive(true);
		dispatch({ type: PresentationEditingActionIdentifiers.selectSecondMedia });
	};

	const onPopoverClose = () => {
		//setActive(false);
		isActive.current = false;
		revertImage();
		originalSlide.current = undefined;
		dispatch({ type: PresentationEditingActionIdentifiers.editingMediaStarted });
	};

	useEffect(() => {
		return function onClose() {
			//setActive(false);
			isActive.current = false;
			revertImage();
		};
	}, []);

	// Second media selected!
	useEffect(() => {
		if (secondActiveMedia != undefined) {
			transferColors();
		}
	}, [secondActiveMedia])

	const revertImage = () => {
		if (originalSlide.current) {
			const newPresentation: SinglePresentation = JSON.parse(JSON.stringify(presentation));
			newPresentation.slides[currentSlide!] = originalSlide.current;
			/*const newLocation: MediaLocation = newPresentation.slides[currentSlide!].media[activeMedia!].location;
			newLocation.local = originalImgSrc.current!;
			newLocation.updatedOn = undefined;*/
			dispatch({
				type: PresentationEditingActionIdentifiers.presentationSettingsUpdated,
				payload: { presentation: newPresentation },
			});
		}
	}

	const transferColors = async () => {

		const sourceMediaIdx: number = secondActiveMedia!; // The color source
		const targetMediaIdx: number = activeMedia!; // The image to transform

		// run transfer script
		let tmpImgPath = await window.electron.invoke('pythontest',
			presentation.slides[currentSlide].media[sourceMediaIdx!].location.local!.replace('file://', ''),
			presentation.slides[currentSlide].media[targetMediaIdx!].location.local!.replace('file://', ''),
		);

		// TODO: Do we really need this?
		//setAnchorElement(e.currentTarget);

		// TODO: Create a function to replace settings easily

		if (isActive.current && (targetMediaIdx == activeMedia!)) {
			const newPresentation: SinglePresentation = JSON.parse(JSON.stringify(presentation));
			const newLocation: MediaLocation = newPresentation.slides[currentSlide!].media[activeMedia!].location;
			newLocation.local = 'file://' + tmpImgPath;
			newLocation.updatedOn = (new Date()).getTime();
			dispatch({
				type: PresentationEditingActionIdentifiers.presentationSettingsUpdated,
				payload: { presentation: newPresentation },
			});
		}

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
				selected={isActive.current}
				onClick={(e) => isActive.current ? onPopoverClose() : onPopoverOpen()}
				ref={anchorElRef}
				{...props}
			/>
			<ColorTransferPopover
				open={isActive.current}
				anchorEl={anchorElRef.current}
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
