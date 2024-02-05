import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { SMPRoutes } from '../types/routes';
import { Home, Login, Loading, Edit, QuickCreate, Pres } from '../views';

const NavigationProvider: React.FC<{}> = (props) => {
	return (
		<HashRouter>
			<Routes>
				<Route path={SMPRoutes.Loading} element={<Loading/>} />
				<Route path={SMPRoutes.Login} element={<Login/>} />
				<Route path={SMPRoutes.Home} element={<Home/>} />
				<Route path={SMPRoutes.Edit} element={<Edit/>} />
				<Route path={SMPRoutes.QuickCreate} element={<QuickCreate/>} />
				<Route path={SMPRoutes.PresentationModeSlides} element={<Pres/>} />
			</Routes>
		</HashRouter>
	);
};

export default NavigationProvider;
