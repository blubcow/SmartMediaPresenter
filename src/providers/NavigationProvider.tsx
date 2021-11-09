import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { SMPRoutes } from '../shared/types/routes';
import { Home, Login, Loading, Edit, QuickCreate } from '../views';

const NavigationProvider: React.FC<{}> = () => {
	return (
		<BrowserRouter>
			<Route exact path={SMPRoutes.Loading} component={Loading} />
			<Route exact path={SMPRoutes.Login} component={Login} />
			<Route exact path={SMPRoutes.Home} component={Home} />
			<Route exact path={SMPRoutes.Edit} component={Edit} />
			<Route exact path={SMPRoutes.QuickCreate} component={QuickCreate} />
		</BrowserRouter>
	);
};

export default NavigationProvider;
