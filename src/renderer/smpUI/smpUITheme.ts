import { createTheme, ThemeOptions } from '@mui/material';

const typography: ThemeOptions['typography'] = () => ({
	fontFamily: 'Montserrat',
});

export const lightTheme = createTheme({
	palette: {
		primary: { main: '#1DA1F2', contrastText: '#F5F8FA' },
		secondary: { main: '#405DE6' },
		background: { default: '#F5F8FA', paper: '#D8E7EF' },
		text: { primary: '#14171A', secondary: '#282E33' },
		success: { main: '#1ba100', contrastText: '#F5F8FA' },
		error: { main: '#E01E5A' },
		warning: { main: '#ECB22E' },
		divider: '#E1EAEF',
		info: { main: '#D8E7EF', contrastText: '#14171A' },
	},
	typography: typography,
	shape: { borderRadius: 20 },
});

export const darkTheme = createTheme({
	palette: {
		primary: { main: '#1DA1F2', contrastText: '#F5F8FA' },
		secondary: { main: '#405DE6' },
		background: { default: '#14171A', paper: '#282E33' },
		text: { primary: '#F5F8FA', secondary: '#D8E7EF' },
		success: { main: '#1ba100', contrastText: '#F5F8FA' },
		error: { main: '#E01E5A' },
		warning: { main: '#ECB22E' },
		divider: '#1B1F23',
		info: { main: '#282E33', contrastText: '#F5F8FA' },
	},
	typography: typography,
	shape: { borderRadius: 20 },
});
