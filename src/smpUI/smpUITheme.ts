import { createTheme } from '@mui/material';

export const lightTheme = createTheme({
	palette: {
		primary: { main: '#1DA1F2' },
		secondary: { main: '#405DE6' },
		background: { default: '#F5F8FA', paper: '#AAB8C2' },
		text: { primary: '#14171A', secondary: '#282E33' },
		success: { main: '#2EB67D' },
		error: { main: '#E01E5A' },
		warning: { main: '#ECB22E' },
	},
});

export const darkTheme = createTheme({
	palette: {
		primary: { main: '#1DA1F2' },
		secondary: { main: '#405DE6' },
		background: { default: '#14171A', paper: '#282E33' },
		text: { primary: '#F5F8FA', secondary: '#AAB8C2' },
		success: { main: '#2EB67D' },
		error: { main: '#E01E5A' },
		warning: { main: '#ECB22E' },
	},
});
