import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../config/firebase.config';
import { useRemoteUserContext } from '../hooks';
import { SMPRoutes } from '../shared/routes.enum';
import { Page } from '../smpUI';
import LoadingIndicatorPaper from './components/LoadingIndicatorPaper';

const LoadingPage: React.FC<{}> = () => {
	const navigate = useNavigate();
	const { remoteUser, userLoggedIn } = useRemoteUserContext();

	useEffect(() => {
		if (userLoggedIn === undefined) return;

		if (!userLoggedIn && config.apiKey !== '') {
			navigate(SMPRoutes.Login);
			return;
		} else {
			navigate(SMPRoutes.Home);
		}
	}, [history, remoteUser, userLoggedIn]);

	return (
		<Page centeredContent>
			<LoadingIndicatorPaper />
		</Page>
	);
};

export default LoadingPage;
