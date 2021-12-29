import React, { useState, useEffect } from 'react';
import { Page } from '../../smpUI/layout';
import HomeTopBar from './HomeTopBar';
import { Box, Row, Text } from '../../smpUI/components';
import { ProjectsHeaderRow } from '../components/rows';
import useStyles from './styles';
import { Divider } from '@mui/material';
import {
	useStoredPresentations,
	useLocalFileSystem,
} from '../../hooks/useMainProcessMethods';
import { useHistory } from 'react-router-dom';
import { SMPRoutes } from '../../types/routes';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../i18n/i18n';
import { SinglePresentation } from '../../shared/types/presentation';
import PresentationPreview from '../components/PresentationPreview';
import { getFormattedDate } from '../../models/DateFormatter';
import usePresentationSyncContext from '../../hooks/usePresentationSyncContext';
import { CloudUpload } from '@mui/icons-material';

const Home: React.FC<{}> = () => {
	const classes = useStyles();
	const {
		presentations,
		createPresentation,
		retrieveSinglePresentationOnce,
		removeSinglePresentation,
	} = useStoredPresentations();
	const history = useHistory();
	const { t } = useTranslation([i18nNamespace.Presentation]);
	const [currentPresentation, setCurrentPresentation] = useState<
		number | undefined
	>();
	const [presentationPreview, setPresentationPreview] = useState<
		SinglePresentation | undefined
	>();
	const { openFileSelectorDialog, importPresentationFromFileSystem } =
		useLocalFileSystem();

	const { addToLocalSyncingQueue, syncingAvailable } =
		usePresentationSyncContext();

	useEffect(() => {
		if (currentPresentation === undefined) {
			setPresentationPreview(undefined);
		} else {
			retrieveSinglePresentationOnce(currentPresentation, (presentation) => {
				setPresentationPreview(presentation);
			});
		}
	}, [currentPresentation]);

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
							importPresentationAction={async () => {
								const files = await openFileSelectorDialog('presentation');
								if (files.length > 0) {
									const file = files[0];
									const filePath = file.location.local as string;

									const pres = (await importPresentationFromFileSystem(
										filePath
									)) as SinglePresentation;
									createPresentation((id: number) => {
										history.push(`${SMPRoutes.Edit}?id=${id}`);
									}, pres);
								}
							}}
						/>
						{presentations.map((presentation, i) => (
							<Row
								title={presentation.name}
								info={`${t('lastChange')}: ${getFormattedDate(
									presentation.created
								)}`}
								rootContainerStyle={{ zIndex: 0 }}
								key={i}
								onClick={() => {
									setCurrentPresentation(presentation.id);
									// history.push(`/edit?id=${presentation.id}`);
								}}
								selected={presentation.id === currentPresentation}
								iconBadge={
									syncingAvailable ? (
										<CloudUpload
											sx={{ color: 'secondary.main', fontSize: '50px' }}
											onClick={() => {
												retrieveSinglePresentationOnce(
													presentation.id,
													(singlePres) => {
														addToLocalSyncingQueue(singlePres, presentation.id);
													}
												);
											}}
										/>
									) : undefined
								}
							/>
						))}
					</Box>
				</Box>
				<Divider orientation='vertical' />
				<Box className={classes.previewContainer}>
					{currentPresentation !== undefined ? (
						<PresentationPreview
							presentation={presentationPreview}
							id={currentPresentation}
							removePresentationAction={removeSinglePresentation}
						/>
					) : (
						<Box className={classes.noPresentationSelectedContainer}>
							<Text variant='h5'>{t('noPresentationSelected')}</Text>
						</Box>
					)}
				</Box>
				<Divider orientation='vertical' />
			</Box>
		</Page>
	);
};

export default Home;
