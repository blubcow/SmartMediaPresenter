import React from 'react';
import { Modal } from '../../smpUI/Modal';
import { IModalProps } from '../../smpUI/Modal';
import { ArrowBackIosNew } from '@mui/icons-material';
import { IconButton } from '@mui/material';

interface IPopUpModalProps extends IModalProps {
	goBack: () => void;
}

const PopUpModal: React.FC<IPopUpModalProps> = (props) => {
	const { goBack, ...modalProps } = props;
	return (
		<Modal {...modalProps}>
			<IconButton onClick={goBack}><ArrowBackIosNew/></IconButton>
			{props.children}
		</Modal>
	);
};

export default PopUpModal;
