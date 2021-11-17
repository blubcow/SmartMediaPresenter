import React from 'react';
import {
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
}

const EditTopBar: React.FC<IEditTopBarProps> = (props) => {
	const {
		currentSlideSettings,
		fileName,
		slideSettingsDidChange,
		selectedMedia,
		mediaSettingsDidChange,
	} = props;

	return (
		<TopBarDisplayingFilename {...props} withFixedHeight={'120px'}>
			<Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
				{selectedMedia ? (
					<MediaSettings
						media={selectedMedia}
						onSettingsChanged={mediaSettingsDidChange}
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
