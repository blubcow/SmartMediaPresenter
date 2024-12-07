import React from 'react';
import { EditableText } from './EditableText';
import { Snackbar, Alert, AlertProps, SnackbarProps, AlertTitle } from '@mui/material';

export type AlertSnackbarProps = SnackbarProps & Pick<AlertProps, 'severity'>;

export const AlertSnackbar: React.FC<AlertSnackbarProps> = (props) => {
	const { severity = 'info', message, title, ...snackbarProps } = props;

	return (
		<Snackbar {...snackbarProps}>
			<Alert severity={severity} variant='filled'>
				{title && <AlertTitle>{title}</AlertTitle>}
				{message && <EditableText variant='body1'>{message}</EditableText>}
			</Alert>
		</Snackbar>
	);
};
