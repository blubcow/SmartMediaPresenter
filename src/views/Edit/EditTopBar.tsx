import React from 'react';
import usePresentationEditingContext from '../../hooks/usePresentationEditingContext';
import {
	Dimensions,
	MediaRessource,
	MediaSettings as MediaSettingsType,
	SlideSettings as SlideSettingsType,
} from '../../shared/types/presentation';
import { Box } from '../../smpUI/components';
import TopBarDisplayingFilename, {
	ITopBarDisplayingFilenameProps,
} from '../components/appBars/TopBarDisplayingFilename';
import MediaSettings from '../components/slideEditing/MediaSettings';
import SlideSettings from '../components/slideEditing/SlideSettings';

interface IEditTopBarProps extends ITopBarDisplayingFilenameProps {}

const EditTopBar: React.FC<IEditTopBarProps> = (props) => {
	const { state } = usePresentationEditingContext();
	const { editingControls } = state;

	return (
		<TopBarDisplayingFilename {...props} withFixedHeight={'120px'}>
			<Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
				{editingControls === 'media' ? <MediaSettings /> : <SlideSettings />}
			</Box>
		</TopBarDisplayingFilename>
	);
};

export default EditTopBar;
