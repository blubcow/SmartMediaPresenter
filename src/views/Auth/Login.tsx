import React from 'react';
import Page from '../../smpUI/layout/Page';
import AuthPaper from '../components/AuthPaper';
import { Box, Button } from '../../smpUI/components';
import useStyles from './styles';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../i18n/i18n';

const Login: React.FC<{}> = () => {
	const classes = useStyles();
	const { t } = useTranslation([i18nNamespace.Auth]);

	return (
		<Page centeredContent>
			<Box className={classes.container}>
				<AuthPaper />
				<Box className={classes.skipLoginButtonContainer}>
					<Link to='/home' style={{ textDecoration: 'none' }}>
						<Button color='warning'>{t('skipLogin')}</Button>
					</Link>
				</Box>
			</Box>
		</Page>
	);
};

export default Login;
