import React from 'react';
import { Page } from '../../smpUI/layout';
import HomeTopBar from './HomeTopBar';
import { Box, Row, Text } from '../../smpUI/components';
import { ProjectsHeaderRow } from '../components/rows';
import useStyles from './styles';
import { CircularProgress, Divider } from '@mui/material';
import { useLocalFileSystem } from '../../hooks/useMainProcessMethods';
import { useHistory } from 'react-router-dom';
import { SMPRoutes } from '../../types/routes';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../i18n/i18n';
import { SinglePresentation } from '../../shared/types/presentation';
import PresentationPreview from '../components/PresentationPreview';
import { getFormattedDate } from '../../models/DateFormatter';
import usePresentationSyncContext from '../../hooks/usePresentationSyncContext';
import usePresentationCacheContext from '../../hooks/usePresentationCacheContext';
import PresentationSyncingButton from '../components/PresentationSyncingButton';

const Home: React.FC<{}> = () => {
	const classes = useStyles();
	const history = useHistory();
	const { t } = useTranslation([i18nNamespace.Presentation]);
	const { openFileSelectorDialog, importPresentationFromFileSystem } =
		useLocalFileSystem();

	const { addToLocalSyncingQueue, syncingAvailable, syncPaper } =
		usePresentationSyncContext();
	const {
		storedPresentations,
		createPresentation,
		retrieveSinglePresentationOnce,
		removeSinglePresentation,
		localSyncingQueue,
		retrieveRemotePresentationOnce,
		downloadAndUpdateLocalPresentation,
		downloadingPresentations,
	} = usePresentationSyncContext();
	const {
		currentPresentationId,
		currentRemotePresentationId,
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
						{storedPresentations.map((presentation, i) => (
							<Row
								title={presentation.name}
								info={`${t('lastChange')}: ${getFormattedDate(
									presentation.created ?? presentation.remoteUpdate!
								)}`}
								secondaryInfo={`${
									presentation.id === undefined
										? t('notLocal')
										: syncPaper.get(presentation.remoteId ?? '') === undefined
										? t('notInCloud')
										: syncPaper.get(presentation.remoteId!)!.remoteUpdate ===
										  presentation.created
										? ''
										: `${t('cloudChanges')}: ${getFormattedDate(
												syncPaper.get(presentation.remoteId!)!.remoteUpdate
										  )}`
								}`}
								rootContainerStyle={{ zIndex: 0 }}
								key={i}
								onClick={() => {
									if (presentation.id !== undefined)
										retrieveSinglePresentationOnce(presentation.id, (pres) => {
											changeCurrentPresentation(
												presentation.id,
												presentation.remoteId,
												pres
											);
										});
									else if (presentation.remoteId !== undefined) {
										retrieveRemotePresentationOnce(
											presentation.remoteId,
											(pres) => {
												changeCurrentPresentation(
													undefined,
													presentation.remoteId,
													pres
												);
											}
										);
									}
								}}
								selected={
									(currentPresentationId !== undefined &&
										presentation.id === currentPresentationId) ||
									(currentRemotePresentationId !== undefined &&
										currentRemotePresentationId === presentation.remoteId)
								}
								sx={{
									cursor: 'pointer',
									bgcolor:
										presentation.id === undefined
											? 'background.paper'
											: undefined,
								}}
								iconBadge={
									syncingAvailable ? (
										localSyncingQueue.find(
											(item) => item.presentationId === presentation.id
										) !== undefined ||
										(presentation.remoteId &&
											downloadingPresentations.includes(
												presentation.remoteId
											)) ? (
											<CircularProgress variant='indeterminate' />
										) : (
											<PresentationSyncingButton
												status={
													presentation.created !== undefined
														? presentation.remoteId &&
														  syncPaper.get(presentation.remoteId!)
															? presentation.created ===
															  syncPaper.get(presentation.remoteId!)!
																	.remoteUpdate
																? 'insync'
																: presentation.created >
																  syncPaper.get(presentation.remoteId!)!
																		.remoteUpdate
																? 'uploadable'
																: 'downloadable'
															: 'uploadable'
														: 'downloadable'
												}
												onDownload={() => {
													if (presentation.remoteId !== undefined) {
														downloadAndUpdateLocalPresentation(
															presentation.remoteId
														);
													}
												}}
												onUpload={() => {
													if (presentation.id !== undefined) {
														retrieveSinglePresentationOnce(
															presentation.id,
															(singlePres) => {
																addToLocalSyncingQueue(
																	singlePres,
																	presentation.id!
																);
															}
														);
													}
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
					{currentPresentationId !== undefined ||
					currentRemotePresentationId !== undefined ? (
						<PresentationPreview
							presentation={
								cachedPresentations.get(
									currentPresentationId ?? currentRemotePresentationId ?? -1
								)?.presentation
							}
							id={currentPresentationId}
							remoteId={currentRemotePresentationId}
							removePresentationAction={removeSinglePresentation}
							isCaching={
								cachedPresentations.get(
									currentPresentationId ?? currentRemotePresentationId ?? -1
								)?.loading ?? true
							}
							failedToLoad={
								cachedPresentations.get(
									currentPresentationId ?? currentRemotePresentationId ?? -1
								)?.failed
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
