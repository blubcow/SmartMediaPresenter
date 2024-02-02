import { useTranslation } from "react-i18next";
import { Box, Popover } from "../../../smpUI/components";
import { IPopoverProps } from '../../../smpUI/components/Popover';
import { i18nNamespace } from "../../../i18n/i18n";
import { padding } from "@mui/system";
import { Box as MUIBox, Paper, Popper, PopperProps } from '@mui/material';
import usePresentationEditingContext from "../../../hooks/usePresentationEditingContext";
import { useEffect } from "react";

type IColorTransferPopoverProps = PopperProps & { onClose?: () => void };

const ColorTransferPopover: React.FC<IColorTransferPopoverProps> = (props) => {
	const { onClose, ...popoverProps } = props;
	const { t } = useTranslation([i18nNamespace.Presentation]);
	const { state, dispatch } = usePresentationEditingContext();

	useEffect(() => {
		return onClose;
	});

	return (
		<Popper placement='bottom' {...popoverProps} sx={{ zIndex: 1300 }}>
			<Paper elevation={8}>
				<MUIBox sx={{
					padding: 2,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center'
				}}>
					{t('colorTransfer.chooseSourceImage')}
				</MUIBox>
			</Paper>
		</Popper>
	);
}

export default ColorTransferPopover;
