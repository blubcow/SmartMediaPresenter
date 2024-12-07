import { CssBaseline, ThemeProvider } from '@mui/material';
import 'react-image-crop/dist/ReactCrop.css';
import './App.css';
import { usePreferredTheme } from './hooks';
import {
	ConnectivityProvider,
	I18NProvider,
	NavigationProvider,
	PresentationCacheProvider, PresentationSyncProvider,
	RemoteUserProvider, UserSettingsProvider
} from './providers';

function App() {

	const { preferredTheme } = usePreferredTheme();
	/*
	useEffect(() =>{
		test();
	})

	const test = async function(){
		//const { ipcRenderer } = window.require('electron');
		//const ipcRenderer:ElectronHandler = await window.electron;
		const ipcRenderer = window.electron;
		ipcRenderer.send('test', 'test');
	}
	*/
	return (
		<RemoteUserProvider>
			<UserSettingsProvider>
				<I18NProvider>
					<ThemeProvider theme={preferredTheme}>
						<CssBaseline>
							<ConnectivityProvider>
								<PresentationCacheProvider>
									<PresentationSyncProvider>
										<NavigationProvider />
									</PresentationSyncProvider>
								</PresentationCacheProvider>
							</ConnectivityProvider>
						</CssBaseline>
					</ThemeProvider>
				</I18NProvider>
			</UserSettingsProvider>
		</RemoteUserProvider>
	);
}

export default App;
