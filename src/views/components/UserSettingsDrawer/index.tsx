import React from 'react';
import { Drawer, Box, Text } from '../../../smpUI/components';
import { IDrawerProps } from '../../../smpUI/components/Drawer';
import ChangeLanguage from './ChangeLanguage';
import ChangeTheme from './ChangeTheme';
import RemoteUser from './RemoteUser';
import { useUserSettingsDrawerStyles } from './styles';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';
import ManageRemoteMedia from './ManageRemoteMedia';
import usePresentationSyncContext from '../../../hooks/usePresentationSyncContext';

interface IUserSettingsDrawerProps extends IDrawerProps {}

const UserSettingsDrawer: React.FC<IUserSettingsDrawerProps> = (props) => {
	const classes = useUserSettingsDrawerStyles();
	const { t } = useTranslation([i18nNamespace.Alert]);
	const { syncingAvailable } = usePresentationSyncContext();

	return (
		<Drawer {...props}>
			<Box className={classes.container}>
				<RemoteUser />
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
					<Text variant='body2'>{`${t('version')}: ${
						process.env.REACT_APP_VERSION
					}`}</Text>
				</Box>
			</Box>
		</Drawer>
	);
};

export default UserSettingsDrawer;
