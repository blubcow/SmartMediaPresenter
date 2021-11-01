import React from 'react';
import { Box, Paper, Text, TextField, Button } from '../../../smpUI/components';
import useThemedLogo from '../../../hooks/useThemedLogo';
import useStyles, {
	useAuthButtonContainerStyles,
	useTextFieldContainerStyles,
} from './styles';

const LoginPaper: React.FC<{}> = () => {
	const logo = useThemedLogo();
	const classes = useStyles();

	return (
		<Paper>
			<Box className={classes.container}>
				<img src={logo.logo} className={classes.img} />
				<Text variant='h4' fontWeight='bold'>
					Login
				</Text>
				<TextFieldContainer />
				<AuthButtonContainer />
			</Box>
		</Paper>
	);
};

const TextFieldContainer = () => {
	const classes = useTextFieldContainerStyles();

	return (
		<Box className={classes.container}>
			<Box className={classes.textFieldContainer}>
				<TextField label='Email' />
			</Box>
			<Box className={classes.textFieldContainer}>
				<TextField label='password' type='password' />
			</Box>
		</Box>
	);
};

const AuthButtonContainer = () => {
	const classes = useAuthButtonContainerStyles();

	return (
		<Box className={classes.container}>
			<Box className={classes.buttonContainer}>
				<Button variant='contained' minWidth='200px'>
					Login
				</Button>
			</Box>
			<Box className={classes.buttonContainer}>
				<Button color='info' minWidth='200px'>
					forgot password?
				</Button>
			</Box>
		</Box>
	);
};

export default LoginPaper;
