import { Box, Drawer, DrawerProps, Theme } from '@mui/material';
import { createStyles, makeStyles } from '@mui/styles';
import React from 'react';
import { useTranslation } from 'react-i18next';
import config from '../../config/firebase.config';
import { i18nNamespace } from '../../i18n/i18n';
import ChangeLanguage from './ChangeLanguage';
import ChangeTheme from './ChangeTheme';
import ManageRemoteMedia from './ManageRemoteMedia';
import RemoteUser from './RemoteUser';
import { usePresentationSyncContext } from '../../hooks';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		container: {
			minWidth: '450px',
			display: 'flex',
			flexDirection: 'column',
			height: '100%',
			padding: theme.spacing(1),
		},
	})
);

const UserSettingsDrawer: React.FC<DrawerProps> = (props) => {
	const classes = useStyles();
	const { t } = useTranslation([i18nNamespace.Alert]);
	const { syncingAvailable } = usePresentationSyncContext();

	return (
		<Drawer {...props}>
			<Box className={classes.container}>
				{config.apiKey !== '' && <RemoteUser />}
				{syncingAvailable && <ManageRemoteMedia />}
				<ChangeLanguage />
				<ChangeTheme />
			</Box>
			<Box
				sx={{
					width: '100%',
					pr: 1,
					display: 'flex',
					justifyContent: 'flex-end',
				}}
			>
				<Box
					sx={{
						padding: 1,
						borderRadius: '10px 10px 0 0',
						bgcolor: 'background.default',
					}}
				>
					
					{/*
					TODO: Fix no access to process env!
					<EditableText variant='body2'>{`${t('version')}: ${
						process.env.REACT_APP_VERSION
					}`}</EditableText>
					*/}
				</Box>
			</Box>
		</Drawer>
	);
};

export default UserSettingsDrawer;
