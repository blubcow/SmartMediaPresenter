import { useTranslation } from "react-i18next";
import { i18nNamespace } from "../../../i18n/i18n";
import { Box, Button, CircularProgress, Box as MUIBox, Paper, Popper, PopperProps, Stack } from '@mui/material';
import usePresentationEditingContext from "../../../hooks/usePresentationEditingContext";
import { forwardRef, useEffect } from "react";
import { Download } from "@mui/icons-material";

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
								{t('colorTransfer.chooseAlgorithm')}
								<Stack direction="row" spacing={0.5} sx={{ mt: 1 }}>
									{/*<Box sx={{ fontSize: '0.8125rem', padding: '4px' }}>Package build:</Box>*/}
									<Button variant="contained" disableElevation onClick={(e) => onChooseMethod(3)} size="small">Reinhard l*a*b*</Button>
									<Button variant="contained" disableElevation onClick={(e) => onChooseMethod(1)} size="small">CIE-LAB</Button>
									<Button variant="contained" disableElevation onClick={(e) => onChooseMethod(0)} size="small">CIE-LAB inverted</Button>
									<Button variant="contained" disableElevation onClick={(e) => onChooseMethod(2)} size="small">PDF + regrain</Button>
								</Stack>
								{showSaveButton && (
									<Stack direction="row" spacing={0.5} sx={{ mt: 1 }}>
										<Button variant="contained" disableElevation color="success" startIcon={<Download/>}
											onClick={(e) => onSaveImage()} size="small">{t('saveImage')}</Button>
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
