import { Box, Dialog, DialogProps } from '@mui/material';
import React from 'react';

export interface IBoxedDialogProps extends DialogProps {}

export const BoxedDialog: React.FC<IBoxedDialogProps> = (props) => {
	return (
		<Dialog {...props}>
			<Box
				sx={{
					padding: 3,
					borderRadius: 1,
				}}
			>
				{props.children}
			</Box>
		</Dialog>
	);
};
