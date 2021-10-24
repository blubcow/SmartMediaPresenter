import React, { useEffect } from 'react';
import Page from '../../smpUI/layout/Page';
import { useHistory } from 'react-router-dom';

const LoadingPage: React.FC<{}> = () => {
	const history = useHistory();

	useEffect(() => {
		setTimeout(() => {
			history.push('/login');
		}, 1000);
	}, []);

	return <Page />;
};

export default LoadingPage;
