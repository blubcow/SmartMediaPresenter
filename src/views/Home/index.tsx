import React from 'react';
import { Page } from '../../smpUI/layout';
import HomeTopBar from './HomeTopBar';
import { Box, Row } from '../../smpUI/components';
import { ProjectsHeaderRow } from '../components/rows';
import useStyles from './styles';
import { Divider } from '@mui/material';
import { useStoredPresentations } from '../../hooks/useMainProcessMethods';
import { useHistory } from 'react-router-dom';
import { SMPRoutes } from '../../shared/types/routes';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../i18n/i18n';

const Home: React.FC<{}> = () => {
	const classes = useStyles();
	const { presentations, createPresentation } = useStoredPresentations();
	const history = useHistory();
	const { t } = useTranslation([i18nNamespace.Presentation]);

	const getFormattedDtate = (date: Date) => {
		return `${date.getDay()}.${date.getMonth()}.${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
	};

	return (
		<Page TopBar={<HomeTopBar />}>
			<Box className={classes.container}>
				<Divider orientation='vertical' />
				<Box className={classes.rowsContainer}>
					<Box className={classes.rowsScrollingContainer}>
						<ProjectsHeaderRow
							ceratePresentationAction={() => {
								createPresentation((id: number) => {
									history.push(`${SMPRoutes.Edit}?id=${id}`);
								});
							}}
							enterQuickCreateAction={() => {
								history.push(SMPRoutes.QuickCreate);
							}}
						/>
						{presentations.map((presentation, i) => (
							<Row
								title={presentation.name}
								info={`${t('lastChange')}: ${getFormattedDtate(
									new Date(presentation.created)
								)}`}
								rootContainerStyle={{ zIndex: 0 }}
								key={i}
								onClick={() => {
									history.push(`/edit?id=${presentation.id}`);
								}}
							/>
						))}
					</Box>
				</Box>
				<Divider orientation='vertical' />
				<Box className={classes.previewContainer}></Box>
				<Divider orientation='vertical' />
			</Box>
		</Page>
	);
};

export default Home;
