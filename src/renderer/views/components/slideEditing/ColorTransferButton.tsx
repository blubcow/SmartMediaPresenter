import React, { useEffect, useRef, useState } from 'react';
import EditingButton from './EditingButton';
import { CropOriginal, SwitchAccessShortcut } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';
import EditButtonLabel from './EditButtonLabel';
import usePresentationEditingContext from '../../../hooks/usePresentationEditingContext';
import { MediaAlignment, MediaLocation, SinglePresentation, Slide } from '../../../shared/types/presentation';
import { PresentationEditingActionIdentifiers } from '../../../types/identifiers';
import MediaAlignemntPopover from './MediaAlignmentPopover';
import ColorTransferPopover from './ColorTransferPopover';
import { useMediaSettingsContext } from '../../../providers/MediaSettingsProvider';
import SaveSlideImagePopover from './SaveSlideImagePopover';

interface IColorTransferButtonProps { }

const ColorTransferButton: React.FC<IColorTransferButtonProps> = (props) => {
	const { t } = useTranslation([i18nNamespace.Presentation]);
	const { state, dispatch } = usePresentationEditingContext();
	const { ref: mediaSettingsRef } = useMediaSettingsContext();
	const { presentation, currentSlide, activeMedia, secondActiveMedia } = state;

	// useRef since state didn't work with async functions (and should not change on render anyways)
	const isActive = useRef<boolean>(false);
	const isProcessed = useRef<boolean>(false);
	//const isSaved = useRef<boolean>(false);
	const originalSlide = useRef<Slide | undefined>(undefined);
	const anchorElRef = useRef<HTMLDivElement>(null);

	const [isLoading, setIsLoading] = useState<boolean>(false);

	// Opening and activating
	const activate = () => {
		if (mediaSettingsRef.current) {
			mediaSettingsRef.current.addEventListener("mousedown", onMediaSettingsClicked, true);
		}
		originalSlide.current = presentation.slides[currentSlide];
		isActive.current = true;
		isProcessed.current = false;
		//isSaved.current = false;
		dispatch({ type: PresentationEditingActionIdentifiers.selectSecondMedia });
	};

	// Closing and exiting ========================

	// Close with same button
	const deActivate = () => {
		destroy();
		dispatch({ type: PresentationEditingActionIdentifiers.editingMediaStarted });
	};

	// Any other button on top edit navigation clicked
	const onMediaSettingsClicked = (e: MouseEvent) => {
		if (anchorElRef.current && !anchorElRef.current.contains(e.target as Node)) {
			deActivate();
		}
	}

	// Exit for some other reason
	useEffect(() => {
		return destroy; // on Close
	}, []);

	// Main destructor
	const destroy = () => {
		if (mediaSettingsRef.current) {
			mediaSettingsRef.current.removeEventListener("mousedown", onMediaSettingsClicked, true);
		}
		isActive.current = false;
		isProcessed.current = false;
		if (originalSlide.current) {
			updatePresentationSlide(currentSlide, originalSlide.current);
		}
		originalSlide.current = undefined;
	}

	// Main functionality ========================

	const onChooseMethod = (method:number, options?:string) => {
		if(secondActiveMedia != undefined) {
			transferColors(method, options);; // async
		}else{
			alert('Could not select second media...');
		}
	}

	// Second media selected!
	/*useEffect(() => {
		if (secondActiveMedia != undefined) {
			transferColors();
		}
	}, [secondActiveMedia])*/

	// TODO: Put this somewhere else
	const updatePresentationSlide = (slideIndex:number, slide: Slide) => {
		const newPresentation: SinglePresentation = JSON.parse(JSON.stringify(presentation));
		newPresentation.slides[slideIndex!] = slide;
		dispatch({
			type: PresentationEditingActionIdentifiers.presentationSettingsUpdated,
			payload: { presentation: newPresentation },
		});
	}

	const transferColors = async (method:number, options?:string) => {
		setIsLoading(true);

		const sourceMediaIdx: number = secondActiveMedia!; // The color source
		const targetMediaIdx: number = activeMedia!; // The image to transform

		try{
			// run transfer script
			let tmpImgPath = await window.electron.invoke('python.simpleColorTransfer',
				originalSlide.current!.media[sourceMediaIdx!].location.local!.replace('file://', ''),
				originalSlide.current!.media[targetMediaIdx!].location.local!.replace('file://', ''),
				//presentation.slides[currentSlide].media[sourceMediaIdx!].location.local!.replace('file://', ''),
				//presentation.slides[currentSlide].media[targetMediaIdx!].location.local!.replace('file://', ''),
				method,
				options
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
			isProcessed.current = true;


		}catch(err){
			// do nothing
		}
		setIsLoading(false);
	}

	const onSaveImage = async ():Promise<void> => {
		// Save image with dialog
		const orginalFilePath = originalSlide.current!.media[activeMedia!].location.local!.replace('file://', '');
		const currentPresentation: SinglePresentation = JSON.parse(JSON.stringify(presentation));
		const filePath = currentPresentation.slides[currentSlide!].media[activeMedia!].location.local!.replace('file://', '');

		try{
			let savedFilePath:string = await window.electron.invoke('python.saveImage', filePath, orginalFilePath);

			// Update slide
			console.log(savedFilePath);
			const currentLocation: MediaLocation = currentPresentation.slides[currentSlide!].media[activeMedia!].location;
			currentLocation.local = 'file://' + savedFilePath;
			currentLocation.updatedOn = (new Date()).getTime();
			dispatch({
				type: PresentationEditingActionIdentifiers.presentationSettingsUpdated,
				payload: { presentation: currentPresentation },
			});

			// Save slide
			originalSlide.current = currentPresentation.slides[currentSlide!];
			deActivate();
			//isSaved.current = true;

		}catch(err){}
	}

	return (
		<>
			<EditingButton
				highlighted={ isLoading }
				icon={
					<SwitchAccessShortcut sx={{ color: 'text.primary', height: '100%', width: '100%' }} />
				}
				secondaryNode={
					<EditButtonLabel>{t('colorTransfer.editButtonLabel')}</EditButtonLabel>
				}
				selected={isActive.current}
				onClick={(e) => isActive.current ? deActivate() : activate()}
				ref={anchorElRef}
				{...props}
			/>
			<ColorTransferPopover
				open={isActive.current}
				anchorEl={anchorElRef.current}
				isLoading={isLoading}
				onChooseMethod={onChooseMethod}
				onSaveImage={onSaveImage}
				showSaveButton={isProcessed.current}
			/>
		</>
	);
};

export default ColorTransferButton;
