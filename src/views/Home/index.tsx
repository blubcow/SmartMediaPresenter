import React from 'react';
import { Page } from '../../smpUI/layout';
import HomeTopBar from './HomeTopBar';

const Home: React.FC<{}> = () => {
	return <Page TopBar={HomeTopBar}>home</Page>;
};

export default Home;
