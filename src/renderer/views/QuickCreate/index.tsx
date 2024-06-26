import React, { useState, useEffect } from 'react';
import { Box } from '../../smpUI/components';
import { Page } from '../../smpUI/layout';
import QuickCreateTopBar from './QuickCreateTopBar';
import useStyles from './styles';
import { Divider } from '@mui/material';
import QuickCreateMediaDropBox from '../components/QuickCreateMediaDropBox';
import QuickCreateSlidesBox from '../components/QuickCreateSlidesBox';
import { getEmptySlide, Slide } from '../../shared/types/presentation';
import { SMPRoutes } from '../../types/routes';
import { useNavigate } from 'react-router-dom';
import { DataTransferIdentifiers } from '../../types/identifiers';
import usePresentationSyncContext from '../../hooks/usePresentationSyncContext';

const QuickCreate: React.FC<{}> = () => {
	const navigate = useNavigate();
	const { createQuickCreatePresentation } = usePresentationSyncContext();
	const [slides, setSlides] = useState<Slide[]>([getEmptySlide()]);
	const [presentationName, setPresentationName] = useState<string>(
		'QuickCreate-Presentation'
	);
	const [selectedRows, setSelectedRows] = useState<number[]>([]);
	const classes = useStyles();
	const [multiInsertionEnabled, setMultiInsertionEnabled] =
		useState<boolean>(false);

	useEffect(() => {
		const handleDrag = (e: DragEvent) => {
			e.preventDefault();
			if (e.dataTransfer)
				if (e.dataTransfer.items.length > 1 && !multiInsertionEnabled)
					setMultiInsertionEnabled(true);
				else if (
					e.dataTransfer.items.length < 2 &&
					multiInsertionEnabled &&
					e.dataTransfer.getData(
						DataTransferIdentifiers.MulitpleRemoteMediaFileInfo
					) === undefined &&
					e.dataTransfer.getData(
						DataTransferIdentifiers.MultipleMediaFileInfo
					) === undefined
				)
					setMultiInsertionEnabled(false);
		};

		const handleDrop = () => {
			if (multiInsertionEnabled) setMultiInsertionEnabled(false);
		};

		const disableMultiInsertion = () => {
			setMultiInsertionEnabled(false);
		};

		document.addEventListener('dragenter', handleDrag);
		document.addEventListener('dragend', disableMultiInsertion);
		document.addEventListener('mouseleave', disableMultiInsertion);
		document.addEventListener('drop', handleDrop);

		return () => {
			document.removeEventListener('dragenter', handleDrag);
			document.removeEventListener('drop', handleDrop);
			document.removeEventListener('dragend', disableMultiInsertion);
			window.removeEventListener('mouseleave', disableMultiInsertion);
		};
	}, [multiInsertionEnabled]);

	return (
		<Page
			TopBar={
				<QuickCreateTopBar
					fileName={presentationName}
					onFilenameChanged={(filename) => setPresentationName(filename)}
					onCreatePresentation={() => {
						createQuickCreatePresentation(presentationName, slides, (id) => {
							navigate(`${SMPRoutes.Edit}?id=${id}`);
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
					multiInsertionEnabled={
						selectedRows.length > 1 || multiInsertionEnabled
					}
				/>
				<Divider orientation='vertical' />
				<QuickCreateMediaDropBox
					onSelectedMediaChanged={(rows) => {
						setSelectedRows([...rows]);
					}}
					selectedRows={selectedRows}
					clearSelectedRows={() => setSelectedRows([])}
					setMultiInsertionEnabled={(enabled) =>
						setMultiInsertionEnabled(enabled)
					}
				/>
				<Divider orientation='vertical' />
			</Box>
		</Page>
	);
};

export default QuickCreate;
