import React, { useEffect } from 'react';
import { Page } from '../smpUI/Page';
import { useNavigate } from 'react-router-dom';
import LoadingIndicatorPaper from './components/LoadingIndicatorPaper';
import { SMPRoutes } from '../shared/routes.enum';
import config from '../config/firebase.config';
import { useRemoteUserContext } from '../hooks';

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
