import { Components, createTheme, CssVarsTheme, Theme, ThemeOptions } from '@mui/material';

const typography: ThemeOptions['typography'] = () => ({
	fontFamily: 'Montserrat',
});

declare module '@mui/material/Paper' {
	interface PaperPropsVariantOverrides {
		modal: true;
	}
 }

const components: Components<Omit<Theme, 'components' | 'palette'> & CssVarsTheme> = {
	MuiTextField: {
		defaultProps: {
			variant: 'filled',
			size: 'small',
			fullWidth: true
		}
	},
	MuiDrawer: {
		defaultProps: {
			variant: 'temporary',
			anchor: 'right'
		}
	},
	MuiPopover: {
		defaultProps: {
			anchorOrigin: {
				vertical: 'bottom',
				horizontal: 'center',
			},
			transformOrigin: {
				vertical: 'top',
				horizontal: 'center',
			}
		}
	},
	MuiPaper: {
		styleOverrides: {
			root: ({ theme }) => ({
				variants: [{
					props: { variant: 'modal' },
					style: {
						padding: theme.spacing(3),
						backgroundColor: theme.palette.background.paper,
						minHeight: '150px',
						height: 'auto',
						width: '45%',
						maxWidth: '550px'
					},
				}]
			})
		},
	}
}

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
	components: components
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
	components: components
});
