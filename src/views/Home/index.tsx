import React from 'react';
import { Page } from '../../smpUI/layout';
import HomeTopBar from './HomeTopBar';
import { Box } from '../../smpUI/components';
import { ProjectsHeaderRow } from '../components/rows';
import useStyles from './styles';
import { Divider } from '@mui/material';

const Home: React.FC<{}> = () => {
	const classes = useStyles();

	return (
		<Page TopBar={HomeTopBar}>
			<Box className={classes.container}>
				<Divider orientation='vertical' />
				<Box className={classes.rowsContainer}>
					<ProjectsHeaderRow />
				</Box>
				<Divider orientation='vertical' />
				<Box className={classes.previewContainer}></Box>
				<Divider orientation='vertical' />
			</Box>
		</Page>
	);
};

export default Home;
