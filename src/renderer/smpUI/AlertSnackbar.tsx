import React from 'react';
import Text from './Text';
import { Snackbar, Alert, AlertProps, SnackbarProps, AlertTitle } from '@mui/material';

export type AlertSnackbarProps = SnackbarProps & Pick<AlertProps, 'severity'>;

const AlertSnackbar: React.FC<AlertSnackbarProps> = (props) => {
	const { severity = 'info', message, title, ...snackbarProps } = props;

	return (
		<Snackbar {...snackbarProps}>
			<Alert severity={severity} variant='filled'>
				{title && <AlertTitle>{title}</AlertTitle>}
				{message && <Text variant='body1'>{message}</Text>}
			</Alert>
		</Snackbar>
	);
};

export default AlertSnackbar;
