import { useTranslation } from "react-i18next";
import { i18nNamespace } from "../../../i18n/i18n";
import { Button, CircularProgress, Box as MUIBox, Paper, Popper, PopperProps, Stack } from '@mui/material';
import usePresentationEditingContext from "../../../hooks/usePresentationEditingContext";
import { forwardRef, useEffect, useRef, useState } from "react";
import { MediaLocation, SinglePresentation, Slide } from "../../../shared/types/presentation";
import { PresentationEditingActionIdentifiers } from "../../../types/identifiers";

type IAutoAlignmentPopoverProps = PopperProps & {
	onLoading?: (isLoading:boolean) => void
};

const AutoAlignmentPopover: React.FC<IAutoAlignmentPopoverProps> = forwardRef((props, ref) => {
	const { open, onLoading, ...popoverProps } = props;
	const { t } = useTranslation([i18nNamespace.Presentation]);
	const { state, dispatch } = usePresentationEditingContext();
	const { presentation, currentSlide, activeMedia, secondActiveMedia } = state;
	
	const originalSlide = useRef<Slide | undefined>(undefined);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [newImgPath, setNewImgPath] = useState<string | undefined>(undefined);

	// This complex construct / destruct functionality could be easier with just removing / adding the component from the parent.
	// The constructor and destructor would then only run in one "useEffect"
	useEffect(() => {
		return destroy;
	}, []);

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
		}
		originalSlide.current = undefined;
		setNewImgPath(undefined);
	}

	// Push loading state to parent
	useEffect(() => {
		if(onLoading)
			onLoading(isLoading)
	}, [isLoading]);

	// TODO: Put this somewhere else
	// TODO: Duplicate found in ColorTransferButton
	const updatePresentationSlide = (slideIndex:number, slide: Slide) => {
		const newPresentation: SinglePresentation = JSON.parse(JSON.stringify(presentation));
		newPresentation.slides[slideIndex!] = slide;
		dispatch({
			type: PresentationEditingActionIdentifiers.presentationSettingsUpdated,
			payload: { presentation: newPresentation },
		});
	}

	const onChooseLeftPosition = () => {
		runPythonImageAlignment(secondActiveMedia!, activeMedia!); // async
	}

	const onChooseRightPosition = () => {
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
			setNewImgPath(tmpImgPath);

			// We can dispatch this to remove the borders around images. But right now the popup resets if this happens.
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

						!(secondActiveMedia != undefined) ? t('autoAlignment.chooseSecondImage') : (

							(newImgPath != undefined) ? '... ready to download file: '+newImgPath : (

								<>
									{t('autoAlignment.choosePosition')}
									<Stack direction="row" spacing={0.5}>
										<Button variant="contained" disableElevation onClick={(e) => onChooseLeftPosition()} size="small">{t('left')}</Button>
										<Button variant="contained" disableElevation onClick={(e) => onChooseRightPosition()} size="small">{t('right')}</Button>
									</Stack>
								</>
							)
						)
					)}
				</MUIBox>
			</Paper>
		</Popper>
	);
})

export default AutoAlignmentPopover;
