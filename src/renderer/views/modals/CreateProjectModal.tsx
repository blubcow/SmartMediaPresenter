import React from 'react';
import { Modal } from '../../smpUI/Modal';
import { EditableText } from '../../smpUI/EditableText';
import { Box} from '@mui/material';
import { IModalProps } from '../../smpUI/Modal';
import {
	Download,
	Create,
	ViewColumn,
	SvgIconComponent,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../i18n/i18n';
import { createStyles, makeStyles } from '@mui/styles';
import { Theme } from '@mui/material';
import { IconBadge } from '../../smpUI/IconBadge';

const useCreateProjectModalStyles = makeStyles((theme: Theme) =>
	createStyles({
		containter: {
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
		},
		optionsContainer: {
			marginTop: theme.spacing(3),
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'space-around',
		},
	})
);

const useCreateProjectOptionStyles = makeStyles((theme: Theme) =>
	createStyles({
		containter: {
			width: '200px',
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			textAlign: 'center',
			padding: theme.spacing(1),
			overflow: 'hidden',
			position: 'relative',
			borderRadius: theme.shape.borderRadius,
		},
	})
);

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
				<EditableText variant='h4' fontWeight={700}>
					{t('createNewPresentation')}
				</EditableText>
				<EditableText variant='body1' sx={{ color: 'text.secondary' }}>
					{t('chooseOption')}
				</EditableText>
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
			<EditableText variant='body2' sx={{ marginTop: 1, color: 'text.secondary' }}>
				{text}
			</EditableText>
		</Box>
	);
};

export default CreateProjectModal;
