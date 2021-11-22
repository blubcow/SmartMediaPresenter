import React from 'react';
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

interface IEditTopBarProps extends ITopBarDisplayingFilenameProps {
	currentSlideSettings?: SlideSettingsType;
	slideSettingsDidChange: (settings: SlideSettingsType) => void;
	selectedMedia?: MediaRessource;
	mediaSettingsDidChange: (settings: Partial<MediaSettingsType>) => void;
	slideEditingBoxDimension: Dimensions;
}

const EditTopBar: React.FC<IEditTopBarProps> = (props) => {
	const {
		currentSlideSettings,
		slideSettingsDidChange,
		selectedMedia,
		mediaSettingsDidChange,
		slideEditingBoxDimension,
	} = props;

	return (
		<TopBarDisplayingFilename {...props} withFixedHeight={'120px'}>
			<Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
				{selectedMedia ? (
					<MediaSettings
						media={selectedMedia}
						onSettingsChanged={mediaSettingsDidChange}
						slideMediaBoxDimensions={slideEditingBoxDimension}
					/>
				) : (
					<SlideSettings
						settings={currentSlideSettings}
						slideColorDidChange={(color) => {
							slideSettingsDidChange({ ...currentSlideSettings, color: color });
						}}
					/>
				)}
			</Box>
		</TopBarDisplayingFilename>
	);
};

export default EditTopBar;
