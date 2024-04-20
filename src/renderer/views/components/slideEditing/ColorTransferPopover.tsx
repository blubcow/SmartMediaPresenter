import { useTranslation } from "react-i18next";
import { i18nNamespace } from "../../../i18n/i18n";
import { Box, Button, CircularProgress, Box as MUIBox, Paper, Popper, PopperProps, Stack } from '@mui/material';
import usePresentationEditingContext from "../../../hooks/usePresentationEditingContext";
import { forwardRef, useEffect } from "react";

type IColorTransferPopoverProps = PopperProps & {
	//onClose?: () => void,
	isLoading: boolean,
	onChooseMethod: (method:number, options?:string) => void,
	onSaveImage: () => void,
	showSaveButton: boolean
};

const ColorTransferPopover: React.FC<IColorTransferPopoverProps> = forwardRef((props, ref) => {
	const { /*onClose,*/ isLoading, onChooseMethod, onSaveImage, showSaveButton, ...popoverProps } = props;
	const { t } = useTranslation([i18nNamespace.Presentation]);
	const { state, dispatch } = usePresentationEditingContext();
	const { secondActiveMedia } = state;

	useEffect(() => {
    // TODO: What to do? We will never close as long as the button is visible...
		//return onClose;
	}, []);

	return (
		<Popper placement='bottom' {...popoverProps} sx={{ zIndex: 1300 }}>
			<Paper elevation={8} ref={ref}>
				<MUIBox sx={{
					padding: 2,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center'
				}}>
					{isLoading ? <CircularProgress color="primary" /> : (

						!(secondActiveMedia != undefined) ? t('colorTransfer.chooseSourceImage') : (

							<>
								<Stack direction="row" spacing={0.5}>
									<Box sx={{ fontSize: '0.8125rem', padding: '4px' }}>Package build:</Box>
									<Button variant="contained" disableElevation onClick={(e) => onChooseMethod(0)} size="small">Method 1</Button>
									<Button variant="contained" disableElevation onClick={(e) => onChooseMethod(1)} size="small">Method 2</Button>
									<Button variant="contained" disableElevation onClick={(e) => onChooseMethod(2)} size="small">Method 3</Button>
									<Button variant="contained" disableElevation onClick={(e) => onChooseMethod(3)} size="small">Method 4</Button>
								</Stack>
								<Stack direction="row" spacing={0.5}>
									<Box sx={{ fontSize: '0.8125rem', padding: '4px' }}>Single file build:</Box>
									<Button variant="contained" disableElevation onClick={(e) => onChooseMethod(0, 'single')} size="small">Method 1</Button>
									<Button variant="contained" disableElevation onClick={(e) => onChooseMethod(1, 'single')} size="small">Method 2</Button>
									<Button variant="contained" disableElevation onClick={(e) => onChooseMethod(2, 'single')} size="small">Method 3</Button>
									<Button variant="contained" disableElevation onClick={(e) => onChooseMethod(3, 'single')} size="small">Method 4</Button>
								</Stack>
								<Stack direction="row" spacing={0.5}>
									<Box sx={{ fontSize: '0.8125rem', padding: '4px' }}>Wrap paths in quotes:</Box>
									<Button variant="contained" disableElevation onClick={(e) => onChooseMethod(0, 'quotes')} size="small">Method 1</Button>
									<Button variant="contained" disableElevation onClick={(e) => onChooseMethod(1, 'quotes')} size="small">Method 2</Button>
									<Button variant="contained" disableElevation onClick={(e) => onChooseMethod(2, 'quotes')} size="small">Method 3</Button>
									<Button variant="contained" disableElevation onClick={(e) => onChooseMethod(3, 'quotes')} size="small">Method 4</Button>
								</Stack>
								<Stack direction="row" spacing={0.5}>
									<Box sx={{ fontSize: '0.8125rem', padding: '4px' }}>Wrap command in quotes:</Box>
									<Button variant="contained" disableElevation onClick={(e) => onChooseMethod(0, 'cmdquotes')} size="small">Method 1</Button>
									<Button variant="contained" disableElevation onClick={(e) => onChooseMethod(1, 'cmdquotes')} size="small">Method 2</Button>
									<Button variant="contained" disableElevation onClick={(e) => onChooseMethod(2, 'cmdquotes')} size="small">Method 3</Button>
									<Button variant="contained" disableElevation onClick={(e) => onChooseMethod(3, 'cmdquotes')} size="small">Method 4</Button>
								</Stack>
								<Stack direction="row" spacing={0.5}>
									<Box sx={{ fontSize: '0.8125rem', padding: '4px' }}>Python call:</Box>
									<Button variant="contained" disableElevation onClick={(e) => onChooseMethod(0, 'python')} size="small">Method 1</Button>
									<Button variant="contained" disableElevation onClick={(e) => onChooseMethod(1, 'python')} size="small">Method 2</Button>
									<Button variant="contained" disableElevation onClick={(e) => onChooseMethod(2, 'python')} size="small">Method 3</Button>
									<Button variant="contained" disableElevation onClick={(e) => onChooseMethod(3, 'python')} size="small">Method 4</Button>
								</Stack>
								{showSaveButton && (
									<Stack direction="row" spacing={0.5}>
										<Button variant="contained" disableElevation onClick={(e) => onSaveImage()} size="small">Save image</Button>
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

export default ColorTransferPopover;
