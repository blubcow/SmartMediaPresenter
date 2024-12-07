import { Box, Divider, Theme } from '@mui/material';
import { createStyles, makeStyles } from '@mui/styles';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { usePresentationCacheContext, usePresentationSyncContext, useSinglePresentation } from '../hooks';
import { PresentationEditingProvider } from '../providers';
import { Page } from '../smpUI';
import LoadingIndicatorPaper from './components/LoadingIndicatorPaper';
import EditTopBar from './EditTopBar';
import PresentationEditingFloatingButtons from './presentation/PresentationEditingFloatingButtons';
import PresentationEditingPreviewRows from './presentation/PresentationEditingPreviewRows';
import SlideEditingBox from './slideEditing/SlideEditingBox';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		container: {
			width: '100%',
			height: '100%',
			display: 'flex',
			// overflow: 'hidden',
		},
		previewContainer: {
			//height: '100%',
			flex: 1,
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			paddingTop: theme.spacing(1),
		},
		loadingContainer: {
			height: '100vh',
			width: '100vw',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
		},
	})
);


const Edit: React.FC<{}> = (props) => {
	const [id, setId] = useState<string>('');
	const location = useLocation();
	const { storedPresentation, saveChanges } = useSinglePresentation(
		parseInt(id)
	);
	const { updatePresentation } = usePresentationCacheContext();
	const { presentationDidUpdate } = usePresentationSyncContext();
	const classes = useStyles();

	useEffect(() => {
		const id = new URLSearchParams(location.search).get('id');
		setId(id ?? '');
	}, [location.search]);

	return storedPresentation !== undefined ? (
		<PresentationEditingProvider
			presentationId={parseInt(id)}
			initialPresentation={{ ...storedPresentation }}
		>
			<Page TopBar={<EditTopBar fileName={storedPresentation?.name} />}>
				<PresentationEditingFloatingButtons
					onSave={(pres) => {
						saveChanges(pres);
						const currentId = parseInt(id);
						updatePresentation(currentId, pres);
						presentationDidUpdate();
					}}
				/>
				<Box className={classes.container}>
					<Divider orientation='vertical' />
					<PresentationEditingPreviewRows />
					<Divider orientation='vertical' />
					<Box className={classes.previewContainer}>
						<SlideEditingBox />
					</Box>
					<Divider orientation='vertical' />
				</Box>
			</Page>
		</PresentationEditingProvider>
	) : (
		<Box className={classes.loadingContainer}>
			<LoadingIndicatorPaper />
		</Box>
	);
};

export default Edit;
