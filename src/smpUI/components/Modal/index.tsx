import React from 'react';
import { Dialog, DialogProps } from '@mui/material';
import { Box } from '..';

interface IModalProps extends DialogProps {}

const Modal: React.FC<IModalProps> = (props) => {
	return (
		<Dialog {...props}>
			<Box sx={{ padding: 3 }}>{props.children}</Box>
		</Dialog>
	);
};

export default Modal;
