import React from 'react';
import ThemeProvider from './providers/ThemeProvider';
import NavigationProvider from './providers/NavigationProvider';

function App() {
	return (
		<ThemeProvider>
			<NavigationProvider />
		</ThemeProvider>
	);
}

export default App;
