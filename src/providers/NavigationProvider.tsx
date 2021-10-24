import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Login from '../views/Auth/Login';
import LoadingPage from '../views/Loading';

const NavigationProvider: React.FC<{}> = () => {
	return (
		<BrowserRouter>
			<Route path='/login' component={Login} />
			<Route path='/' component={LoadingPage} />
		</BrowserRouter>
	);
};

export default NavigationProvider;
