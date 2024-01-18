import React from 'react';
import {
	Snackbar as MuiSnackbar,
	Alert,
	SnackbarProps,
	AlertTitle,
} from '@mui/material';
import { Text } from '..';

export interface ISnackbarProps extends SnackbarProps {
	severity?: 'success' | 'warning' | 'info' | 'error';
}

const Snackbar: React.FC<ISnackbarProps> = (props) => {
	const { severity = 'info', message, title } = props;
	return (
		<MuiSnackbar {...props}>
			<Alert severity={severity} variant='filled'>
				{title && <AlertTitle>{title}</AlertTitle>}
				{message && <Text variant='body1'>{message}</Text>}
			</Alert>
		</MuiSnackbar>
	);
};

export default Snackbar;
