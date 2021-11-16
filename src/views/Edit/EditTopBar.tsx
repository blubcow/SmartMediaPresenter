import React from 'react';
import { SlideSettings as SlideSettingsType } from '../../shared/types/presentation';
import { Box } from '../../smpUI/components';
import TopBarDisplayingFilename, {
	ITopBarDisplayingFilenameProps,
} from '../components/appBars/TopBarDisplayingFilename';
import RemoveButton from '../components/slideEditing/RemoveButton';
import SlideSettings from '../components/slideEditing/SlideSettings';

interface IEditTopBarProps extends ITopBarDisplayingFilenameProps {
	currentSlideSettings?: SlideSettingsType;
	slideSettingsDidChange: (settings: SlideSettingsType) => void;
}

const EditTopBar: React.FC<IEditTopBarProps> = (props) => {
	const { currentSlideSettings, fileName, slideSettingsDidChange } = props;

	return (
		<TopBarDisplayingFilename {...props} withFixedHeight={'120px'}>
			<Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
				<SlideSettings
					settings={currentSlideSettings}
					slideColorDidChange={(color) => {
						slideSettingsDidChange({ ...currentSlideSettings, color: color });
					}}
				/>
			</Box>
		</TopBarDisplayingFilename>
	);
};

export default EditTopBar;
