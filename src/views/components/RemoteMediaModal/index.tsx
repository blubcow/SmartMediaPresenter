import React from 'react';
import { Modal, Box, Button, Text } from '../../../smpUI/components';
import { IModalProps } from '../../../smpUI/components/Modal';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';
import useStyles from './styles';
import { Divider } from '@mui/material';
import { CreateNewFolder, UploadFile, Delete } from '@mui/icons-material';

interface IRemoteMediaModalProps extends IModalProps {}

const RemoteMediaModal: React.FC<IRemoteMediaModalProps> = (props) => {
	const { t } = useTranslation([i18nNamespace.Remote]);

	const classes = useStyles();

	return (
		<Modal {...props} maxWidth={false}>
			<Box className={classes.container}>
				<Box className={classes.header}>
					<Text fontWeight='bold' variant='h5'>
						{t('manageRemoteMedia')}
					</Text>
					<Box className={classes.headerBtnContainer}>
						<Button variant='contained' size='small'>
							<CreateNewFolder className={classes.btnIcon} />
							{t('newFolder')}
						</Button>
						<Button variant='contained' size='small'>
							<UploadFile className={classes.btnIcon} />
							{t('uploadMedia')}
						</Button>
						<Button variant='contained' size='small' color='secondary'>
							<Delete className={classes.btnIcon} />
							{t('delete')}
						</Button>
					</Box>
				</Box>
				<Divider />
				<Box className={classes.content}></Box>
				<Divider />
				<Box className={classes.footerBtnContainer}>
					<Box />
					<Button variant='contained' size='small' color='secondary'>
						{t('close')}
					</Button>
				</Box>
			</Box>
		</Modal>
	);
};

export default RemoteMediaModal;
