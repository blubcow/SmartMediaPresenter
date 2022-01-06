import React, { useState, useEffect } from 'react';
import { Page } from '../../smpUI/layout';
import HomeTopBar from './HomeTopBar';
import { Box, Row, Text } from '../../smpUI/components';
import { ProjectsHeaderRow } from '../components/rows';
import useStyles from './styles';
import { CircularProgress, Divider } from '@mui/material';
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
import { CloudUpload, CloudDone, CloudDownload } from '@mui/icons-material';
import usePresentationCacheContext from '../../hooks/usePresentationCacheContext';

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
	const { openFileSelectorDialog, importPresentationFromFileSystem } =
		useLocalFileSystem();

	const { addToLocalSyncingQueue, syncingAvailable, syncPaper } =
		usePresentationSyncContext();
	const { localSyncingQueue } = usePresentationSyncContext();
	const {
		currentPresentationId,
		cachedPresentations,
		changeCurrentPresentation,
	} = usePresentationCacheContext();

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
									retrieveSinglePresentationOnce(presentation.id, (pres) => {
										changeCurrentPresentation(presentation.id, pres);
									});
								}}
								selected={presentation.id === currentPresentationId}
								style={{ cursor: 'pointer' }}
								iconBadge={
									syncingAvailable ? (
										localSyncingQueue.find(
											(item) => item.presentationId === presentation.id
										) !== undefined ? (
											<CircularProgress variant='indeterminate' />
										) : presentation.remoteId &&
										  syncPaper.get(presentation.remoteId!) ? (
											presentation.created ===
											syncPaper.get(presentation.remoteId!)! ? (
												<CloudDone
													sx={{ color: 'primary.main', fontSize: '50px' }}
												/>
											) : presentation.created >
											  syncPaper.get(presentation.remoteId!)! ? (
												<CloudUpload
													sx={{
														color: 'secondary.main',
														fontSize: '50px',
														cursor: 'pointer',
													}}
													onClick={() => {
														retrieveSinglePresentationOnce(
															presentation.id,
															(singlePres) => {
																addToLocalSyncingQueue(
																	singlePres,
																	presentation.id
																);
															}
														);
													}}
												/>
											) : (
												<CloudDownload
													sx={{
														color: 'secondary.main',
														fontSize: '50px',
														cursor: 'pointer',
													}}
												/>
											)
										) : (
											<CloudUpload
												sx={{
													color: 'secondary.main',
													fontSize: '50px',
													cursor: 'pointer',
												}}
												onClick={() => {
													retrieveSinglePresentationOnce(
														presentation.id,
														(singlePres) => {
															addToLocalSyncingQueue(
																singlePres,
																presentation.id
															);
														}
													);
												}}
											/>
										)
									) : undefined
								}
							/>
						))}
					</Box>
				</Box>
				<Divider orientation='vertical' />
				<Box className={classes.previewContainer}>
					{currentPresentationId !== undefined ? (
						<PresentationPreview
							presentation={
								cachedPresentations.get(currentPresentationId ?? -1)
									?.presentation
							}
							id={currentPresentationId}
							removePresentationAction={removeSinglePresentation}
							isCaching={
								cachedPresentations.get(currentPresentationId ?? -1)?.loading ??
								true
							}
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
