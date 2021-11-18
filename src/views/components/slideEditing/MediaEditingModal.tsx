import React, { ReactNode } from 'react';
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
