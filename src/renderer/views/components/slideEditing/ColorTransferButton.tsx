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

	const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | undefined>(undefined);
	//const [activated, setActivated] = useState<boolean>(false);

	//const isActive = ():boolean => anchorEl != undefined;
	const [active, setActive] = React.useState<boolean>(false);
	const anchorElRef = useRef(null);

	const onPopoverOpen = () => {
		setActive(true);
		dispatch({ type: PresentationEditingActionIdentifiers.selectSecondMedia });
	};

	const onPopoverClose = () => {
		setActive(false);
		// TODO: See in function how to make it better
		dispatch({ type: PresentationEditingActionIdentifiers.editingMediaStarted });
	};

	useEffect(() => {
		return function onClose() {

		};
	});

	// Second media selected!
	useEffect(() => {
		if (secondActiveMedia != undefined) {
			transferColors();

			// TODO: Get original file, reset the file on quit somehow
		}
	}, [secondActiveMedia])



	const transferColors = async () => {
		console.log(presentation);

		const sourceMediaIdx: number = secondActiveMedia!; // The color source
		const targetMediaIdx: number = activeMedia!; // The image to transform

		// run transfer script
		let tmpImgPath = await window.electron.invoke('pythontest',
			presentation.slides[currentSlide].media[sourceMediaIdx!].location.local!.replace('file://', ''),
			presentation.slides[currentSlide].media[targetMediaIdx!].location.local!.replace('file://', ''),
		);

		// Need to always have the latest version!
		tmpImgPath = tmpImgPath;

		// TODO: Do we really need this?
		//setAnchorElement(e.currentTarget);

		// TODO: Create a function to replace settings easily

		const newPresentation: SinglePresentation = JSON.parse(JSON.stringify(presentation));
		const newLocation: MediaLocation = newPresentation.slides[currentSlide!].media[activeMedia!].location;
		newLocation.local = 'file://' + tmpImgPath;
		newLocation.updatedOn = (new Date()).getTime();
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
				selected={active}
				onClick={(e) => active ? onPopoverClose() : onPopoverOpen()}
				ref={anchorElRef}
				{...props}
			/>
			<ColorTransferPopover
				open={active}
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
