import { Box, Button, CircularProgress, Theme } from '@mui/material';
import { createStyles, makeStyles } from '@mui/styles';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../i18n/i18n';
import { BoxedDialog, EditableText, IBoxedDialogProps } from '../../smpUI';

export const useImportLocalPresentationsModalStyles = makeStyles((theme: Theme) =>
	createStyles({
		container: {
			width: '350px',
			display: 'flex',
			flexDirection: 'column',
			gap: theme.spacing(3),
			alignItems: 'center',
			textAlign: 'center',
		},
		btnContainer: {
			width: '100%',
			display: 'flex',
			justifyContent: 'space-between',
		},
	})
);

interface IImportLocalPresentationsModalProps extends IBoxedDialogProps {
	onChoose: (importPresentations: boolean) => void;
	amnt: number;
	importing: boolean;
}

const ImportLocalPresentationsModal: React.FC<IImportLocalPresentationsModalProps> =
	(props) => {
		const { onChoose, amnt, importing, ...modalProps } = props;
		const { t } = useTranslation([i18nNamespace.Presentation]);
		const classes = useImportLocalPresentationsModalStyles();

		return (
			<BoxedDialog {...modalProps}>
				<Box className={classes.container}>
					<EditableText variant='h6' fontWeight={800}>
						{importing
							? t('importingLocalPresentations')
							: t('importLocalPresentations', { amount: amnt })}
					</EditableText>
					{importing ? (
						<CircularProgress />
					) : (
						<Box className={classes.btnContainer}>
							<Button
								variant='contained'
								color='secondary'
								onClick={() => onChoose(false)}
							>
								{t('no')}
							</Button>
							<Button variant='contained' onClick={() => onChoose(true)}>
								{t('yes')}
							</Button>
						</Box>
					)}
				</Box>
			</BoxedDialog>
		);
	};

export default ImportLocalPresentationsModal;
