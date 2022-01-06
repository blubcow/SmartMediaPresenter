import React from 'react';
import ThemeProvider from './providers/ThemeProvider';
import NavigationProvider from './providers/NavigationProvider';
import I18NProvider from './providers/I18NProvider';
import 'react-image-crop/dist/ReactCrop.css';
import UserSettingsProvider from './providers/UserSettingsProvider';
import RemoteUserProvider from './providers/RemoteUserProvider';
import PresentationSyncProvider from './providers/PresentationSyncProvider';
import PresentationCacheProvider from './providers/PresentationCacheProvider';

function App() {
	return (
		<RemoteUserProvider>
			<UserSettingsProvider>
				<I18NProvider>
					<ThemeProvider>
						<PresentationCacheProvider>
							<PresentationSyncProvider>
								<NavigationProvider />
							</PresentationSyncProvider>
						</PresentationCacheProvider>
					</ThemeProvider>
				</I18NProvider>
			</UserSettingsProvider>
		</RemoteUserProvider>
	);
}

export default App;
