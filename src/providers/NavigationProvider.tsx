import React from 'react';
import { HashRouter, Route } from 'react-router-dom';
import { SMPRoutes } from '../types/routes';
import { Home, Login, Loading, Edit, QuickCreate, Pres } from '../views';

const NavigationProvider: React.FC<{}> = (props) => {
	return (
		<HashRouter>
			<Route exact path={SMPRoutes.Loading} component={Loading} />
			<Route exact path={SMPRoutes.Login} component={Login} />
			<Route exact path={SMPRoutes.Home} component={Home} />
			<Route exact path={SMPRoutes.Edit} component={Edit} />
			<Route exact path={SMPRoutes.QuickCreate} component={QuickCreate} />
			<Route exact path={SMPRoutes.PresentationModeSlides} component={Pres} />
		</HashRouter>
	);
};

export default NavigationProvider;
