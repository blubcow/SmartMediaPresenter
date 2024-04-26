import { useTranslation } from "react-i18next";
import { i18nNamespace } from "../../../i18n/i18n";
import { Button, CircularProgress, Box as MUIBox, Paper, Popper, PopperProps, Stack } from '@mui/material';
import usePresentationEditingContext from "../../../hooks/usePresentationEditingContext";
import { forwardRef, useEffect, useRef, useState } from "react";
import { MediaLocation, SinglePresentation, Slide } from "../../../shared/types/presentation";
import { PresentationEditingActionIdentifiers } from "../../../types/identifiers";
import { Download } from "@mui/icons-material";

type IAutoAlignmentPopoverProps = PopperProps & {
	onLoading?: (isLoading:boolean) => void,
	onProcessed?: (isProcessed:boolean) => void,
	onFileSaved?: () => void,
};

const AutoAlignmentPopover: React.FC<IAutoAlignmentPopoverProps> = forwardRef((props, ref) => {
	const { open, onLoading, onProcessed, onFileSaved, ...popoverProps } = props;
	const { t } = useTranslation([i18nNamespace.Presentation]);
	const { state, dispatch } = usePresentationEditingContext();
	const { presentation, currentSlide, activeMedia, secondActiveMedia } = state;
	
	const originalSlide = useRef<Slide | undefined>(undefined);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isProcessed, setIsProcessed] = useState<boolean>(false);

	useEffect(() => {
		return destroy;
	}, []);

	// The popover can be closed without destruction
	useEffect(() => {
		if(open){
			construct();
		}else{
			destroy();
		}
	}, [open]);

	const construct = () => {
		if (!originalSlide.current) {
			originalSlide.current = presentation.slides[currentSlide];
		}
	}

	const destroy = () => {
		if (originalSlide.current) {
			updatePresentationSlide(currentSlide, originalSlide.current);
			originalSlide.current = undefined;
		}
		setIsLoading(false);
		setIsProcessed(false);
	}

	// Push loading state to parent
	useEffect(() => {
		if(onLoading) onLoading(isLoading)
	}, [isLoading]);

	useEffect(() => {
		if(onProcessed) onProcessed(isProcessed)
	}, [isProcessed]);

	// TODO: Create a global slide updater
	// TODO: Duplicate found in ColorTransferButton
	const updatePresentationSlide = (slideIndex:number, slide: Slide) => {
		const newPresentation: SinglePresentation = JSON.parse(JSON.stringify(presentation));
		newPresentation.slides[slideIndex!] = slide;
		dispatch({
			type: PresentationEditingActionIdentifiers.presentationSettingsUpdated,
			payload: { presentation: newPresentation },
		});
	}

	const chooseLeftPosition = () => {
		runPythonImageAlignment(secondActiveMedia!, activeMedia!); // async
	}

	const chooseRightPosition = () => {
		runPythonImageAlignment(activeMedia!, secondActiveMedia!); // async
	}

	const runPythonImageAlignment = async (leftMediaIdx:number, rightMediaIdx:number) => {
		setIsLoading(true);

		const leftImg = originalSlide.current!.media[leftMediaIdx!].location.local!.replace('file://', '')
		const rightImg = originalSlide.current!.media[rightMediaIdx!].location.local!.replace('file://', '')

		try{
			// run script
			let tmpImgPath = await window.electron.invoke('python.imageAlignment', leftImg, rightImg);

			// Abort if popover is closed
			if(!presentation || !originalSlide.current || (leftMediaIdx != activeMedia! && rightMediaIdx != activeMedia!))
				return;

			const slide = JSON.parse(JSON.stringify(originalSlide.current)) as Slide;
			slide.columns = 1;
			slide.rows = 1;
			slide.media[0].location.local = 'file://' + tmpImgPath;
			slide.media[0].location.updatedOn = (new Date()).getTime();
			updatePresentationSlide(currentSlide!, slide);
			setIsProcessed(true);

			// TODO: We can dispatch this to remove the borders around images. But right now the popup resets if this happens.
			// In the meantime I implemented a bugfix in "MediaBox" checking for "imgRef.current"
			/*
			dispatch({
				type: PresentationEditingActionIdentifiers.editingMediaStarted,
				payload: { activeMedia: 0, secondActiveMedia: undefined }
			});
			*/

		}catch(err){
			// do nothing, errors are shown by IPC
		}
		setIsLoading(false);
	}

	const saveImage = async ():Promise<void> => {
		// Save image with dialog
		const orginalFilePath = originalSlide.current!.media[activeMedia!].location.local!.replace('file://', '');
		//const currentPresentation: SinglePresentation = JSON.parse(JSON.stringify(presentation));
		const filePath = presentation.slides[currentSlide!].media[activeMedia!].location.local!.replace('file://', '');

		try{
			let savedFilePath:string = await window.electron.invoke('python.saveImage', filePath, orginalFilePath);

			// Update slide
			//const slide:Slide = JSON.parse(JSON.stringify(currentPresentation.slides[currentSlide!])) as Slide;
			const slide:Slide = JSON.parse(JSON.stringify(presentation.slides[currentSlide!])) as Slide;
			slide.media[0].location.local = 'file://' + savedFilePath;
			slide.media[0].location.updatedOn = (new Date()).getTime();
			updatePresentationSlide(currentSlide!, slide);

			// Save slide
			//originalSlide.current = currentPresentation.slides[currentSlide!];
			originalSlide.current = undefined;
			if(onFileSaved) onFileSaved();
			//isSaved.current = true;

		}catch(err){}
	}

	return (
		<Popper placement='bottom' open={open} {...popoverProps} sx={{ zIndex: 1300, maxWidth: 500, textAlign: 'center', overflowWrap: 'anywhere' }}>
			<Paper elevation={8} ref={ref}>
				<MUIBox sx={{
					padding: 2,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center'
				}}>
					{isLoading ? <CircularProgress color="primary" /> : (

						// Choose images
						(secondActiveMedia == undefined) ? t('autoAlignment.chooseSecondImage') : (

						// Choose position & save image
						<>
							{t('autoAlignment.choosePosition')}
							<Stack direction="row" spacing={0.5} sx={{ mt: 1 }}>
								<Button variant="contained" disableElevation onClick={(e) => chooseLeftPosition()} size="small">{t('left')}</Button>
								<Button variant="contained" disableElevation onClick={(e) => chooseRightPosition()} size="small">{t('right')}</Button>
							</Stack>
						
							{isProcessed &&	(
								<Stack direction="row" spacing={0.5} sx={{ mt: 1 }}>
									<Button variant="contained" disableElevation color="success" startIcon={<Download/>}
										onClick={(e) => saveImage()} size="small">Save image</Button>
								</Stack>
							)}
						</>
						)
					)}
				</MUIBox>
			</Paper>
		</Popper>
	);
})

export default AutoAlignmentPopover;
