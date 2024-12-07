import { AccountCircle } from '@mui/icons-material';
import { Box, Button } from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRemoteUserContext } from '../../hooks';
import { i18nNamespace } from '../../i18n/i18n';
import { auth } from '../../models/firebase';
import { BoxedDialog, EditableText } from '../../smpUI';
import AuthViews from '../auth/AuthViews';

const RemoteUser: React.FC<{}> = () => {
	const { remoteUser } = useRemoteUserContext();
	const { t } = useTranslation([i18nNamespace.Auth]);

	const [openLoginModal, setOpenLoginModal] = useState<boolean>(false);

	const startLogin = () => setOpenLoginModal(true);
	const logout = auth.signOut;

	return (
		<Box sx={{ padding: 1, width: '100%' }}>
			<Box
				sx={{
					padding: 2,
					width: '100%',
					boxShadow: 10,
					borderRadius: 1,

					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
				}}
			>
				<AccountCircle style={{ fontSize: '80px' }} />
				<Box sx={{ mt: 1 }}>
					<EditableText>{remoteUser ? remoteUser.email : t('noUsrLoggedIn')}</EditableText>
				</Box>
				<Box sx={{ mt: 1 }}>
					<Button
						variant='contained'
						color={remoteUser ? 'secondary' : 'primary'}
						onClick={remoteUser ? logout : startLogin}
					>
						{t(remoteUser ? 'logout' : 'login')}
					</Button>
				</Box>
			</Box>
			<BoxedDialog open={openLoginModal} onClose={() => setOpenLoginModal(false)}>
				<AuthViews onLogin={() => setOpenLoginModal(false)} />
			</BoxedDialog>
		</Box>
	);
};

export default RemoteUser;
