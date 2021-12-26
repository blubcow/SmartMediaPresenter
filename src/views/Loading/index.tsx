import React, { useEffect } from 'react';
import Page from '../../smpUI/layout/Page';
import { useHistory } from 'react-router-dom';
import LoadingIndicatorPaper from '../components/LoadingIndicatorPaper';
import useRemoteUserContext from '../../hooks/useRemoteUserContext';
import { SMPRoutes } from '../../types/routes';

const LoadingPage: React.FC<{}> = () => {
	const history = useHistory();
	const { remoteUser, userLoggedIn } = useRemoteUserContext();

	useEffect(() => {
		if (userLoggedIn === undefined) return;

		if (!userLoggedIn) {
			history.push(SMPRoutes.Login);
			return;
		} else {
			// TODO: sync usersettings whit remote settings and load remotley available presentations
			history.push(SMPRoutes.Home);
		}
	}, [history, remoteUser, userLoggedIn]);

	return (
		<Page centeredContent>
			<LoadingIndicatorPaper />
		</Page>
	);
};

export default LoadingPage;
