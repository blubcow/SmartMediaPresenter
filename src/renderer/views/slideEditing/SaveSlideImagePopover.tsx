import { Button, Box as MUIBox, Paper, Popper, PopperProps } from '@mui/material';
import { forwardRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { usePresentationEditingContext } from '../../hooks';
import { i18nNamespace } from "../../i18n/i18n";

type ISaveSlideImagePopoverProps = PopperProps & {
};

const SaveSlideImagePopover: React.FC<ISaveSlideImagePopoverProps> = forwardRef((props, ref) => {
	const { ...popoverProps } = props;
	const { t } = useTranslation([i18nNamespace.Presentation]);
	const { state, dispatch } = usePresentationEditingContext();
	const { secondActiveMedia } = state;

	useEffect(() => {
    // TODO: What to do? We will never close as long as the button is visible...
		//return onClose;
	}, []);

    const onSaveImage = () => {

    }

	return (
		<Popper placement='bottom' {...popoverProps} sx={{ zIndex: 1300 }}>
			<Paper elevation={8} ref={ref}>
				<MUIBox sx={{
					padding: 2,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center'
				}}>
					<Button variant="contained" disableElevation onClick={(e) => onSaveImage()} size="small">{t('saveImage')}</Button>
               </MUIBox>
			</Paper>
		</Popper>
	);
});

export default SaveSlideImagePopover;
