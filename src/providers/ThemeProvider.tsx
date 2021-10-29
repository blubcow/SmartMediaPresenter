import React, { PropsWithChildren } from 'react';
import { CssBaseline, ThemeProvider as MUIThemeProvider } from '@mui/material';
import { darkTheme } from '../smpUI/smpUITheme';
import usePreferredTheme from '../hooks/usePreferredTheme';

const ThemeProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
	const { preferredTheme } = usePreferredTheme();

	return (
		<MUIThemeProvider theme={preferredTheme}>
			<CssBaseline>{children}</CssBaseline>
		</MUIThemeProvider>
	);
};

export default ThemeProvider;
