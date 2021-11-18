import React, { useEffect } from 'react';
import Page from '../../smpUI/layout/Page';
import { useHistory } from 'react-router-dom';
import LoadingIndicatorPaper from '../components/LoadingIndicatorPaper';

const LoadingPage: React.FC<{}> = () => {
	const history = useHistory();

	useEffect(() => {
		setTimeout(() => {
			history.push('/login');
		}, 1000);
	}, [history]);

	return (
		<Page centeredContent>
			<LoadingIndicatorPaper />
		</Page>
	);
};

export default LoadingPage;
