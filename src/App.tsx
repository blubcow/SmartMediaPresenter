import React from 'react';
import ThemeProvider from './providers/ThemeProvider';
import NavigationProvider from './providers/NavigationProvider';
import I18NProvider from './providers/I18NProvider';
import 'react-image-crop/dist/ReactCrop.css';

function App() {
	return (
		<I18NProvider>
			<ThemeProvider>
				<NavigationProvider />
			</ThemeProvider>
		</I18NProvider>
	);
}

export default App;
