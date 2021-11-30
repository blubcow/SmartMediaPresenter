import React from 'react';
import usePresentationEditingContext from '../../hooks/usePresentationEditingContext';
import {
	Dimensions,
	MediaRessource,
	MediaSettings as MediaSettingsType,
	SlideSettings as SlideSettingsType,
} from '../../shared/types/presentation';
import { Box } from '../../smpUI/components';
import { PresentationEditingActionIdentifiers } from '../../types/identifiers';
import TopBarDisplayingFilename, {
	ITopBarDisplayingFilenameProps,
} from '../components/appBars/TopBarDisplayingFilename';
import MediaSettings from '../components/slideEditing/MediaSettings';
import SlideSettings from '../components/slideEditing/SlideSettings';

interface IEditTopBarProps extends ITopBarDisplayingFilenameProps {}

const EditTopBar: React.FC<IEditTopBarProps> = (props) => {
	const { state, dispatch } = usePresentationEditingContext();
	const { presentation, editingControls } = state;

	return (
		<TopBarDisplayingFilename
			{...props}
			withFixedHeight={'120px'}
			onFilenameChanged={(filename) => {
				const newPresentation = { ...presentation };
				newPresentation.name = filename;
				dispatch({
					type: PresentationEditingActionIdentifiers.presentationSettingsUpdated,
					payload: { presentation: newPresentation },
				});
			}}
		>
			<Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
				{editingControls === 'media' ? <MediaSettings /> : <SlideSettings />}
			</Box>
		</TopBarDisplayingFilename>
	);
};

export default EditTopBar;
