import { useState, useEffect } from 'react';
import { darkTheme, lightTheme } from '../smpUI/smpUITheme';

const usePreferredTheme = () => {
	const [preferredTheme, setPreferredTheme] = useState(
		window.matchMedia('(prefers-color-scheme: dark)').matches
			? darkTheme
			: lightTheme
	);
	const themeListener = (event: MediaQueryListEvent) => {
		setPreferredTheme(event.matches ? darkTheme : lightTheme);
	};

	useEffect(() => {
		const darkThemeListener = window.matchMedia('(prefers-color-scheme: dark)');
		darkThemeListener.addEventListener('change', themeListener);

		return () => {
			darkThemeListener.removeEventListener('change', themeListener);
		};
	}, []);

	return { preferredTheme };
};

export default usePreferredTheme;
