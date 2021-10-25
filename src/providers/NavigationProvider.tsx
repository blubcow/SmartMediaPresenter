import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Login from '../views/Auth/Login';
import LoadingPage from '../views/Loading';

const NavigationProvider: React.FC<{}> = () => {
	return (
		<BrowserRouter>
			<Route exact path='/' component={LoadingPage} />
			<Route exact path='/login' component={Login} />
		</BrowserRouter>
	);
};

export default NavigationProvider;
