import { ArrowBackIosNew } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import React from 'react';
import { BoxedDialog, IBoxedDialogProps } from '../../smpUI';

interface IPopUpModalProps extends IBoxedDialogProps {
	goBack: () => void;
}

export const PopUpModal: React.FC<IPopUpModalProps> = (props) => {
	const { goBack, ...modalProps } = props;
	return (
		<BoxedDialog {...modalProps}>
			<IconButton onClick={goBack}><ArrowBackIosNew/></IconButton>
			{props.children}
		</BoxedDialog>
	);
};
