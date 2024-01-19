import React from 'react';
import ThemeProvider from './providers/ThemeProvider';
import NavigationProvider from './providers/NavigationProvider';
import I18NProvider from './providers/I18NProvider';
import 'react-image-crop/dist/ReactCrop.css';
import UserSettingsProvider from './providers/UserSettingsProvider';
import RemoteUserProvider from './providers/RemoteUserProvider';
import PresentationSyncProvider from './providers/PresentationSyncProvider';
import PresentationCacheProvider from './providers/PresentationCacheProvider';
import ConnectivityProvider from './providers/ConnectivityProvider';

function App() {
	return (
		<RemoteUserProvider>
			<UserSettingsProvider>
				<I18NProvider>
					<ThemeProvider>
						<ConnectivityProvider>
							<PresentationCacheProvider>
								<PresentationSyncProvider>
									<NavigationProvider />
								</PresentationSyncProvider>
							</PresentationCacheProvider>
						</ConnectivityProvider>
					</ThemeProvider>
				</I18NProvider>
			</UserSettingsProvider>
		</RemoteUserProvider>
	);
}

export default App;
