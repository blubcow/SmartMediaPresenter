import React, { useState } from 'react';
import { Box, Text, Button, TextField } from '../../../smpUI/components';
import useThemedLogo from '../../../hooks/useThemedLogo';
import useStyles, {
	useAuthButtonContainerStyles,
	useTextFieldContainerStyles,
} from '../AuthViews/styles';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';
import { auth } from '../../../models/firebase';
import PopUpModal from './PopUpModal';
import CreateAccount from './CreateAccount';
import ForgotPassword from './ForgotPassword';

interface ILoginProps {
	onLogin: () => void;
}

const Login: React.FC<ILoginProps> = (props) => {
	const logo = useThemedLogo();
	const classes = useStyles();
	const { t } = useTranslation([i18nNamespace.Auth]);

	const { onLogin } = props;

	return (
		<Box className={classes.container}>
			<img src={logo.logo} className={classes.img} alt='SMP-Logo' />
			<Text variant='h4' fontWeight='bold'>
				{t('login')}
			</Text>
			<FormContainer {...props} />
			<AuthButtonContainer onAccountCreated={onLogin} />
		</Box>
	);
};

interface IFormContainerProps {
	onLogin: () => void;
}

const FormContainer: React.FC<IFormContainerProps> = (props) => {
	const { onLogin } = props;

	const classes = useTextFieldContainerStyles();
	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const { t } = useTranslation([i18nNamespace.Auth]);

	const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsLoading(true);
		auth
			.signIn(email, password)
			.then((_) => {
				// successfull sign in
				onLogin();
			})
			.catch((error) => {
				// sign in failed
				setEmail('');
				setPassword('');
			})
			.finally(() => setIsLoading(false));
	};

	return (
		<Box className={classes.container}>
			<form onSubmit={handleLogin}>
				<Box className={classes.textFieldContainer}>
					<TextField
						label={t('email')}
						type='email'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						disabled={isLoading}
						autoComplete='email'
						id='email'
					/>
				</Box>
				<Box className={classes.textFieldContainer}>
					<TextField
						label={t('pwd')}
						type='password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						disabled={isLoading}
						autoComplete='current-password'
						id='current-password'
					/>
				</Box>
				<Box className={classes.buttonContainer}>
					<Button
						variant='contained'
						minWidth='200px'
						type='submit'
						isLoading={isLoading}
						disabled={isLoading}
					>
						{t('login')}
					</Button>
				</Box>
			</form>
		</Box>
	);
};

interface IAuthButtonContainerProps {
	onAccountCreated?: () => void;
}

const AuthButtonContainer: React.FC<IAuthButtonContainerProps> = (props) => {
	const { onAccountCreated } = props;

	const classes = useAuthButtonContainerStyles();
	const { t } = useTranslation([i18nNamespace.Auth]);
	const [createAccountOpen, setCreateAccountOpen] = useState<boolean>(false);
	const [forgotPasswordOpen, setForgotPasswordOpen] = useState<boolean>(false);

	return (
		<Box className={classes.container}>
			<Button
				color='primary'
				size='small'
				onClick={() => setForgotPasswordOpen(true)}
			>
				{t('forgotPwd')}
			</Button>
			<Button
				color='primary'
				size='small'
				onClick={() => setCreateAccountOpen(true)}
			>
				{t('createAccount')}
			</Button>
			<PopUpModal
				open={createAccountOpen}
				onClose={() => setCreateAccountOpen(false)}
				goBack={() => setCreateAccountOpen(false)}
			>
				<CreateAccount
					onAccountCreated={() => {
						setCreateAccountOpen(false);
						if (onAccountCreated) onAccountCreated();
					}}
				/>
			</PopUpModal>
			<PopUpModal
				open={forgotPasswordOpen}
				onClose={() => setForgotPasswordOpen(false)}
				goBack={() => setForgotPasswordOpen(false)}
			>
				<ForgotPassword onForgotPwd={() => setForgotPasswordOpen(false)} />
			</PopUpModal>
		</Box>
	);
};

export default Login;
