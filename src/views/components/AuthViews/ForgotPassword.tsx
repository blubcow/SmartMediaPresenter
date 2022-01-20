import React, { useState } from 'react';
import { Box, Text, Button, TextField } from '../../../smpUI/components';
import useStyles, { useTextFieldContainerStyles } from './styles';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';
import { auth } from '../../../models/firebase';

interface IForgotPasswordProps {
	onForgotPwd: () => void;
}

const ForgotPassword: React.FC<IForgotPasswordProps> = (props) => {
	const { onForgotPwd } = props;

	const classes = useStyles();
	const { t } = useTranslation([i18nNamespace.Auth]);

	return (
		<Box className={classes.container}>
			<Text variant='h4' fontWeight='bold'>
				{t('forgotPwd')}
			</Text>
			<FormContainer onForgotPwd={onForgotPwd} />
		</Box>
	);
};

interface IFormContainerProps {
	onForgotPwd: () => void;
}

const FormContainer: React.FC<IFormContainerProps> = (props) => {
	const { onForgotPwd } = props;

	const classes = useTextFieldContainerStyles();
	const { t } = useTranslation([i18nNamespace.Auth]);
	const [email, setEmail] = useState<string>('');
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const handleAccountCreation = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsLoading(true);
		auth
			.sendForgotPwdEmail(email)
			.then((_) => {
				onForgotPwd();
			})
			.catch((error) => {
				setEmail('');
			})
			.finally(() => setIsLoading(false));
	};

	return (
		<Box className={classes.container}>
			<form onSubmit={handleAccountCreation}>
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
				<Box className={classes.buttonContainer}>
					<Button
						variant='contained'
						minWidth='200px'
						type='submit'
						isLoading={isLoading}
						disabled={isLoading}
					>
						{t('send')}
					</Button>
				</Box>
			</form>
		</Box>
	);
};

export default ForgotPassword;
