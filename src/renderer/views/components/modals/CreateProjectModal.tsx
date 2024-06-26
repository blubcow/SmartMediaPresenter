import React from 'react';
import { Box, Modal, Text, IconBadge } from '../../../smpUI/components';
import { IModalProps } from '../../../smpUI/components/Modal';
import {
	Download,
	Create,
	ViewColumn,
	SvgIconComponent,
} from '@mui/icons-material';
import {
	useCreateProjectModalStyles,
	useCreateProjectOptionStyles,
} from './styles';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';

interface ICreateProjectModalProps extends IModalProps {
	createPresentationAction: () => void;
	importPresentationAction: () => void;
	enterQuickCreateAction: () => void;
}

const CreateProjectModal: React.FC<ICreateProjectModalProps> = (props) => {
	const {
		createPresentationAction,
		importPresentationAction,
		enterQuickCreateAction,
		...modalProps
	} = props;
	const classes = useCreateProjectModalStyles();
	const { t } = useTranslation([i18nNamespace.Presentation]);

	return (
		<Modal {...modalProps}>
			<Box className={classes.containter}>
				<Text variant='h4' fontWeight={700}>
					{t('createNewPresentation')}
				</Text>
				<Text variant='body1' sx={{ color: 'text.secondary' }}>
					{t('chooseOption')}
				</Text>
				<Box className={classes.optionsContainer}>
					<CreateProjectOption
						icon={Create}
						text={t('createEmtpyPresentation')}
						onClick={createPresentationAction}
					/>
					<CreateProjectOption
						icon={Download}
						text={t('importExistingPresentation')}
						onClick={importPresentationAction}
					/>
					<CreateProjectOption
						icon={ViewColumn}
						text={t('createWithQuickCreate')}
						onClick={enterQuickCreateAction}
					/>
				</Box>
			</Box>
		</Modal>
	);
};

const CreateProjectOption = (props: {
	icon: SvgIconComponent;
	text: string;
	onClick: () => any;
}) => {
	const { icon, text, onClick } = props;
	const classes = useCreateProjectOptionStyles();

	return (
		<Box className={classes.containter}>
			<IconBadge
				icon={icon}
				iconSize='40px'
				clickable
				onClick={onClick}
				sx={{ bgcolor: 'background.default' }}
			/>
			<Text variant='body2' sx={{ marginTop: 1, color: 'text.secondary' }}>
				{text}
			</Text>
		</Box>
	);
};

export default CreateProjectModal;
