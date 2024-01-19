import { useState, useEffect } from 'react';
import { Theme } from '@mui/material';
import { preferredTheme } from '../shared/types/userSettings';
import { darkTheme, lightTheme } from '../smpUI/smpUITheme';
import useUserSettingsContext from './useUserSettingsContext';

const usePreferredTheme = () => {
	const [preferredTheme, setPreferredTheme] = useState<Theme>(
		window.matchMedia('(prefers-color-scheme: dark)').matches
			? darkTheme
			: lightTheme
	);
	const [auto, setAuto] = useState<boolean>(true);
	const { userSettings } = useUserSettingsContext();

	const themeListener = (event: MediaQueryListEvent) => {
		if (!auto) return;
		setPreferredTheme(event.matches ? darkTheme : lightTheme);
	};

	useEffect(() => {
		changeTheme(userSettings.theme ?? 'auto');
	}, [userSettings.theme]);

	useEffect(() => {
		const darkThemeListener = window.matchMedia('(prefers-color-scheme: dark)');
		darkThemeListener.addEventListener('change', themeListener);

		return () => {
			darkThemeListener.removeEventListener('change', themeListener);
		};
	}, []);

	const changeTheme = (theme: preferredTheme) => {
		setAuto(theme === 'auto');
		setPreferredTheme(
			theme === 'auto'
				? window.matchMedia('(prefers-color-scheme: dark)').matches
					? darkTheme
					: lightTheme
				: theme === 'dark'
				? darkTheme
				: lightTheme
		);
	};

	return { preferredTheme };
};

export default usePreferredTheme;
