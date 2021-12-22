import React, { useState } from 'react';
import useRemoteUserContext from '../../../hooks/useRemoteUserContext';
import { Box, Text, Button, Modal } from '../../../smpUI/components';
import { AccountCircle } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';
import { auth } from '../../../models/firebase';

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
					<Text>{remoteUser ? remoteUser.email : t('noUsrLoggedIn')}</Text>
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
			<Modal
				open={openLoginModal}
				onClose={() => setOpenLoginModal(false)}
			></Modal>
		</Box>
	);
};

export default RemoteUser;
