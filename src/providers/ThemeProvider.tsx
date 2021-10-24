import React, { PropsWithChildren } from 'react';
import { CssBaseline, ThemeProvider as MUIThemeProvider } from '@mui/material';
import { darkTheme } from '../smpUI/smpUITheme';

const ThemeProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
	return (
		<MUIThemeProvider theme={darkTheme}>
			<CssBaseline>{children}</CssBaseline>
		</MUIThemeProvider>
	);
};

export default ThemeProvider;
