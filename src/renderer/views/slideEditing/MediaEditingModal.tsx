import React, { PropsWithChildren, ReactNode, useEffect } from 'react';
import Text from '../../smpUI/Text';
import { Box, Button} from '@mui/material';
import Modal, { IModalProps } from '../../smpUI/Modal';
import { useMediaEditingModalStyles } from './styles';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../i18n/i18n';

// TODO: Incorrectly extended type (use child references instead of "content")
interface IMediaEditingModalProps extends IModalProps {
	title: string;
	onEditingFinished: () => void;
	onCancel: () => void;
}

const MediaEditingModal: React.FC<PropsWithChildren<IMediaEditingModalProps>> = ({children, ...props}) => {
	const { title, onEditingFinished, onCancel, content, ...modalProps } = props;
	const classes = useMediaEditingModalStyles();
	const { t } = useTranslation([i18nNamespace.Presentation]);

	useEffect(() => {
		const handleKey = (e: KeyboardEvent) => {
			switch (e.key) {
				case 'Enter':
					onEditingFinished();
					document.removeEventListener('keypress', handleKey);
					break;
				default:
					break;
			}
		};

		if (!props.open) {
			document.removeEventListener('keypress', handleKey);
			return;
		}

		document.addEventListener('keypress', handleKey);
		return () => {
			document.removeEventListener('keypress', handleKey);
		};
	}, [onEditingFinished, props.open]);

	return (
		<Modal {...modalProps}>
			<Box className={classes.container}>
				<Text variant='h3'>{title}</Text>
				<Box className={classes.contentContainer}>
					{children}
				</Box>
				<Box className={classes.btnContainer}>
					<Button variant='contained' color='secondary' onClick={onCancel}>
						{t('cancel')}
					</Button>
					<Button variant='contained' onClick={onEditingFinished}>
						{t('confirm')}
					</Button>
				</Box>
			</Box>
		</Modal>
	);
};

export default MediaEditingModal;
