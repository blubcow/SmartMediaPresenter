import React, { useState } from 'react';
import { Box } from '../../smpUI/components';
import { Page } from '../../smpUI/layout';
import QuickCreateTopBar from './QuickCreateTopBar';
import useStyles from './styles';
import { Divider } from '@mui/material';
import QuickCreateMediaDropBox from '../components/QuickCreateMediaDropBox';
import QuickCreateSlidesBox from '../components/QuickCreateSlidesBox';
import { getEmptySlide, Slide } from '../../shared/types/presentation';
import { SMPRoutes } from '../../shared/types/routes';
import { useHistory } from 'react-router-dom';
import { useStoredPresentations } from '../../hooks/useMainProcessMethods';
import { QuickCreateMediaResource } from '../../shared/types/quickCreate';

const QuickCreate: React.FC<{}> = () => {
	const history = useHistory();
	const { createQuickCreatePresentation } = useStoredPresentations();
	const [slides, setSlides] = useState<Slide[]>([getEmptySlide()]);
	const [presentationName, setPresentationName] = useState<string>(
		'QuickCreate-Presentation'
	);
	const [selectedRows, setSelectedRows] = useState<number[]>([]);
	const [initialSelectedRows, setInitialSelectedRows] = useState<number[]>([]);
	const classes = useStyles();

	return (
		<Page
			TopBar={
				<QuickCreateTopBar
					fileName={presentationName}
					onFilenameChanged={(filename) => setPresentationName(filename)}
					onCreatePresentation={() => {
						createQuickCreatePresentation(presentationName, slides, (id) => {
							history.replace(`${SMPRoutes.Edit}?id=${id}`);
						});
					}}
				/>
			}
		>
			<Box className={classes.container}>
				<Divider orientation='vertical' />
				<QuickCreateSlidesBox
					slides={slides}
					onSlidesDidChange={(newSlides: Slide[]) => {
						setSlides([...newSlides]);
						setSelectedRows([]);
					}}
					multiInsertionEnabled={selectedRows.length > 1}
				/>
				<Divider orientation='vertical' />
				<QuickCreateMediaDropBox
					onSelectedMediaChanged={(rows) => {
						setSelectedRows([...rows]);
					}}
					selectedRows={selectedRows}
					clearSelectedRows={() => setSelectedRows([])}
				/>
				<Divider orientation='vertical' />
			</Box>
		</Page>
	);
};

export default QuickCreate;
