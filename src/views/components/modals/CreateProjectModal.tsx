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

interface ICreateProjectModalProps extends IModalProps {
	createPresentationAction: () => any;
	enterQuickCreateAction: () => any;
}

const CreateProjectModal: React.FC<ICreateProjectModalProps> = (props) => {
	const { createPresentationAction, enterQuickCreateAction } = props;
	const classes = useCreateProjectModalStyles();

	return (
		<Modal {...props}>
			<Box className={classes.containter}>
				<Text variant='h4' fontWeight={700}>
					create a new project
				</Text>
				<Text variant='body1' sx={{ color: 'text.secondary' }}>
					choose an option
				</Text>
				<Box className={classes.optionsContainer}>
					<CreateProjectOption
						icon={Create}
						text='create an emtpy project'
						onClick={createPresentationAction}
					/>
					<CreateProjectOption
						icon={Download}
						text='import an existing project'
						onClick={() => {}}
					/>
					<CreateProjectOption
						icon={ViewColumn}
						text='create with QuickCreate'
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
