import React, { PropsWithChildren, useEffect } from 'react';
import { CssBaseline, ThemeProvider as MUIThemeProvider } from '@mui/material';
import usePreferredTheme from '../hooks/usePreferredTheme';
import useUserSettingsContext from '../hooks/useUserSettingsContext';

const ThemeProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
	const { preferredTheme, changeTheme } = usePreferredTheme();
	const { userSettings } = useUserSettingsContext();

	useEffect(() => {
		changeTheme(userSettings.theme);
	}, [userSettings.theme]);

	return (
		<MUIThemeProvider theme={preferredTheme}>
			<CssBaseline>{children}</CssBaseline>
		</MUIThemeProvider>
	);
};

export default ThemeProvider;
