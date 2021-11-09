import React, { useEffect } from 'react';
import Page from '../../smpUI/layout/Page';
import { useHistory } from 'react-router-dom';
import LoadingIndicatorPaper from '../components/LoadingIndicatorPaper';
import useStyels from './styles';

const LoadingPage: React.FC<{}> = () => {
	const history = useHistory();
	const classes = useStyels();

	useEffect(() => {
		setTimeout(() => {
			history.push('/login');
		}, 1000);
	}, []);

	return (
		<Page centeredContent>
			<LoadingIndicatorPaper />
		</Page>
	);
};

export default LoadingPage;
