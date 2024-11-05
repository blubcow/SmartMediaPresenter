import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { SMPRoutes } from '../types/routes';
import Login from '../views/Login';
import LoadingPage from '../views/LoadingPage';
import Home from '../views/Home';
import Edit from '../views/Edit';
import QuickCreate from '../views/QuickCreate';
import Presentation from '../views/Presentation';

const NavigationProvider: React.FC<{}> = (props) => {
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

export default NavigationProvider;
