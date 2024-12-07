import { Box, Button, Theme } from '@mui/material';
import { createStyles, makeStyles } from '@mui/styles';
import React, { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../i18n/i18n';
import { IBoxedDialogProps, BoxedDialog, EditableText } from '../../smpUI';

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

interface IActionConfirmationModalProps extends IBoxedDialogProps {
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
		<BoxedDialog {...modalProps}>
			<Box className={classes.contentContainer}>
				<EditableText variant='h5' fontWeight='bold' color='text.secondary'>
					{t('actionConfirmationQuestion')}
				</EditableText>
				<Box className={classes.secondaryTextContainer}>
					<EditableText>{secondaryText}</EditableText>
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
		</BoxedDialog>
	);
};

export default ActionConfirmationModal;
