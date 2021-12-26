import React from 'react';
import { Modal, IconButton } from '../../../smpUI/components';
import { IModalProps } from '../../../smpUI/components/Modal';
import { ArrowBackIosNew } from '@mui/icons-material';

interface IPopUpModalProps extends IModalProps {
	goBack: () => void;
}

const PopUpModal: React.FC<IPopUpModalProps> = (props) => {
	const { goBack } = props;
	return (
		<Modal {...props}>
			<IconButton icon={ArrowBackIosNew} onClick={goBack} />

			{props.children}
		</Modal>
	);
};

export default PopUpModal;
