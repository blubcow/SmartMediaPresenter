import React from 'react';
import { Modal, Box, Text, Button } from '../../../smpUI/components';
import { IModalProps } from '../../../smpUI/components/Modal';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';
import { useImportLocalPresentationsModalStyles } from './styles';
import { CircularProgress } from '@mui/material';

interface IImportLocalPresentationsModalProps extends IModalProps {
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
			<Modal {...modalProps}>
				<Box className={classes.container}>
					<Text variant='h6' fontWeight={800}>
						{importing
							? t('importingLocalPresentations')
							: t('importLocalPresentations', { amount: amnt })}
					</Text>
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
			</Modal>
		);
	};

export default ImportLocalPresentationsModal;
