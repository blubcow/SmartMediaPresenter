import React, {
	useEffect,
	useState,
	createContext,
	PropsWithChildren,
} from 'react';
import { Box, Text } from '../smpUI/components';
import { WifiOff } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../i18n/i18n';

export const ConnectivityContext = createContext({});

const ConnectivityProvider: React.FC<PropsWithChildren<{}>> = ({
	children,
}) => {
	const { t } = useTranslation([i18nNamespace.Alert]);
	const [connected, setConnected] = useState<boolean>(true);
	useEffect(() => {
		const handleOnline = () => setConnected(true);
		const handleOffline = () => setConnected(false);
		window.addEventListener('online', handleOnline);
		window.addEventListener('offline', handleOffline);
		return () => {
			window.removeEventListener('online', handleOnline);
			window.removeEventListener('offline', handleOffline);
		};
	}, []);

	return (
		<ConnectivityContext.Provider value={{ connected: connected }}>
			{children}
			{
				<Box
					sx={{
						position: 'absolute',
						top: 0,
						left: 0,
						height: '100vh',
						width: '100vw',
						overflow: 'hidden',
						pointerEvents: 'none',
						userSelect: 'none',
					}}
				>
					<Box
						className='connectivityIndicator'
						sx={{
							padding: 2,
							display: 'flex',
							gap: 1,
							position: 'absolute',
							left: '50%',
							bottom: '10px',
							transform: `translate(-50%, ${connected ? '150%' : 0})`,
							bgcolor: 'error.main',
							borderRadius: 1,
							boxShadow: 5,
							alignItems: 'center',
							pointerEvents: 'none',
							userSelect: 'none',
							transition: 'all 0.3s ease-in-out',
						}}
					>
						<WifiOff sx={{ color: 'white', fontSize: '30px' }} />
						<Text fontWeight={800} color='white'>
							{t('noInternet')}
						</Text>
					</Box>
				</Box>
			}
		</ConnectivityContext.Provider>
	);
};

export default ConnectivityProvider;
