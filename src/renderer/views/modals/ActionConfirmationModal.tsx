import React, { PropsWithChildren } from 'react';
import { Modal, Text, Button, Box } from '../../smpUI';
import { IModalProps } from '../../smpUI/Modal';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../i18n/i18n';
import { createStyles, makeStyles } from '@mui/styles';
import { Theme } from '@mui/material';

export const useActionConfirmationModalStyles = makeStyles((theme: Theme) =>
	createStyles({
		contentContainer: {
			width: '450px',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			textAlign: 'center',
			padding: theme.spacing(1),
		},
		secondaryTextContainer: {
			textAlign: 'center',
			padding: theme.spacing(3),
		},
		buttonContainer: {
			display: 'flex',
			justifyContent: 'space-between',
		},
	})
);

interface IActionConfirmationModalProps extends IModalProps {
	secondaryText?: string;
	onConfirm: () => void;
	onCancel: () => void;
}

const ActionConfirmationModal: React.FC<
	PropsWithChildren<IActionConfirmationModalProps>
> = (props) => {
	const { secondaryText, onConfirm, onCancel, ...modalProps } = props;
	const classes = useActionConfirmationModalStyles();
	const { t } = useTranslation([i18nNamespace.Presentation]);

	return (
		<Modal {...modalProps}>
			<Box className={classes.contentContainer}>
				<Text variant='h5' fontWeight='bold' color='text.secondary'>
					{t('actionConfirmationQuestion')}
				</Text>
				<Box className={classes.secondaryTextContainer}>
					<Text>{secondaryText}</Text>
				</Box>
				{props.children}
				<Box className={classes.buttonContainer}>
					<Button variant='contained' color='secondary' onClick={onCancel}>
						{t('cancel')}
					</Button>
					<Button variant='contained' onClick={onConfirm}>
						{t('confirm')}
					</Button>
				</Box>
			</Box>
		</Modal>
	);
};

export default ActionConfirmationModal;
