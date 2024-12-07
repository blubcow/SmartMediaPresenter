import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { SMPRoutes } from '../shared/routes.enum';
import Edit from '../views/Edit';
import Home from '../views/Home';
import LoadingPage from '../views/LoadingPage';
import Login from '../views/Login';
import Presentation from '../views/Presentation';
import QuickCreate from '../views/QuickCreate';

export const NavigationProvider: React.FC<{}> = (props) => {
	return (
		<HashRouter>
			<Routes>
				<Route path={SMPRoutes.Loading} element={<LoadingPage/>} />
				<Route path={SMPRoutes.Login} element={<Login/>} />
				<Route path={SMPRoutes.Home} element={<Home/>} />
				<Route path={SMPRoutes.Edit} element={<Edit/>} />
				<Route path={SMPRoutes.QuickCreate} element={<QuickCreate/>} />
				<Route path={SMPRoutes.PresentationModeSlides} element={<Presentation/>} />
			</Routes>
		</HashRouter>
	);
};
