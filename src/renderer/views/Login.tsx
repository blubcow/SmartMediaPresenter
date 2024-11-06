import React from 'react';
import Page from '../smpUI/Page';
import AuthPaper from './components/AuthPaper/AuthPaper';
import { Box, Button } from '../smpUI/components';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../i18n/i18n';
import { SMPRoutes } from '../types/routes';
import { createStyles, makeStyles } from '@mui/styles';
import { Theme } from '@mui/material';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		container: {
			width: '100%',
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			justifyContent: 'center',
		},
		skipLoginButtonContainer: {
			width: '100%',
			display: 'flex',
			justifyContent: 'center',
			marginTop: theme.spacing(1),
		},
	})
);


const Login: React.FC<{}> = () => {
	const classes = useStyles();
	const { t } = useTranslation([i18nNamespace.Auth]);

	return (
		<Page centeredContent>
			<Box className={classes.container}>
				<AuthPaper />
				<Box className={classes.skipLoginButtonContainer}>
					<Link to={SMPRoutes.Home} style={{ textDecoration: 'none' }}>
						<Button color='warning'>{t('skipLogin')}</Button>
					</Link>
				</Box>
			</Box>
		</Page>
	);
};

export default Login;
