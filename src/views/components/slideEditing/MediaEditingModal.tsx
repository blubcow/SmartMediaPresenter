import React, { ReactNode, useEffect } from 'react';
import { Box, Button, Text, Modal } from '../../../smpUI/components';
import { IModalProps } from '../../../smpUI/components/Modal';
import { useMediaEditingModalStyles } from './styles';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';

interface IMediaEditingModalProps extends IModalProps {
	title: string;
	onEditingFinished: () => void;
	onCancel: () => void;
	content: ReactNode;
}

const MediaEditingModal: React.FC<IMediaEditingModalProps> = (props) => {
	const { title, onEditingFinished, onCancel, content } = props;
	const classes = useMediaEditingModalStyles();
	const { t } = useTranslation([i18nNamespace.Presentation]);

	useEffect(() => {
		const handleKey = (e: KeyboardEvent) => {
			switch (e.key) {
				case 'Enter':
					onEditingFinished();
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
		<Modal {...props}>
			<Box className={classes.container}>
				<Text variant='h3'>{title}</Text>
				<Box className={classes.contentContainer}>{content}</Box>
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
