import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { Home, Login, Loading } from '../views';

const NavigationProvider: React.FC<{}> = () => {
	return (
		<BrowserRouter>
			<Route exact path='/' component={Loading} />
			<Route exact path='/login' component={Login} />
			<Route exact path='/home' component={Home} />
		</BrowserRouter>
	);
};

export default NavigationProvider;
