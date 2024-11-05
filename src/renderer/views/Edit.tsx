import React, { useState, useEffect } from 'react';
import Page from '../smpUI/Page';
import { Box } from '../smpUI/components';
import { useLocation } from 'react-router-dom';
import { useSinglePresentation } from '../hooks/useMainProcessMethods';
import EditTopBar from './EditTopBar';
import { Divider } from '@mui/material';
import SlideEditingBox from './components/slideEditing/SlideEditingBox';
import PresentationEditingProvider from '../providers/PresentationEditingProvider';
import PresentationEditingFloatingButtons from './components/PresentationEditingFloatingButtons';
import PresentationEditingPreviewRows from './components/PresentationEditingPreviewRows';
import LoadingIndicatorPaper from './components/LoadingIndicatorPaper';
import usePresentationCacheContext from '../hooks/usePresentationCacheContext';
import usePresentationSyncContext from '../hooks/usePresentationSyncContext';
import { createStyles, makeStyles } from '@mui/styles';
import { Theme } from '@mui/material';

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
