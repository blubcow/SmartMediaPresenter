import React from 'react';
import { Box, Text, Button, TextField } from '../../../smpUI/components';
import useThemedLogo from '../../../hooks/useThemedLogo';
import useStyles, {
	useAuthButtonContainerStyles,
	useTextFieldContainerStyles,
} from '../AuthViews/styles';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';

const Login: React.FC<{}> = () => {
	const logo = useThemedLogo();
	const classes = useStyles();
	const { t } = useTranslation([i18nNamespace.Auth]);

	return (
		<Box className={classes.container}>
			<img src={logo.logo} className={classes.img} alt='SMP-Logo' />
			<Text variant='h4' fontWeight='bold'>
				{t('login')}
			</Text>
			<TextFieldContainer />
			<AuthButtonContainer />
		</Box>
	);
};

const TextFieldContainer = () => {
	const classes = useTextFieldContainerStyles();
	const { t } = useTranslation([i18nNamespace.Auth]);

	return (
		<Box className={classes.container}>
			<Box className={classes.textFieldContainer}>
				<TextField label={t('email')} />
			</Box>
			<Box className={classes.textFieldContainer}>
				<TextField label={t('pwd')} type='password' />
			</Box>
		</Box>
	);
};

const AuthButtonContainer = () => {
	const classes = useAuthButtonContainerStyles();
	const { t } = useTranslation([i18nNamespace.Auth]);

	return (
		<Box className={classes.container}>
			<Box className={classes.buttonContainer}>
				<Button variant='contained' minWidth='200px'>
					{t('login')}
				</Button>
			</Box>
			<Box className={classes.secondaryBtnsContainer}>
				<Button color='primary' size='small'>
					{t('forgotPwd')}
				</Button>
				<Button color='primary' size='small'>
					{t('createAccount')}
				</Button>
			</Box>
		</Box>
	);
};

export default Login;
