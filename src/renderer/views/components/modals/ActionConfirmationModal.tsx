import React, { PropsWithChildren } from 'react';
import { Modal, Text, Button, Box } from '../../../smpUI/components';
import { IModalProps } from '../../../smpUI/components/Modal';
import { useActionConfirmationModalStyles } from './styles';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';

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
