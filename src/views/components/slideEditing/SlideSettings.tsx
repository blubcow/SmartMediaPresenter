import React from 'react';
import { SlideSettings as SlideSettingsType } from '../../../shared/types/presentation';
import { Box } from '../../../smpUI/components';
import AddTextButton from './AddTextButton';
import ChangeBackgroundColorButton from './ChangeBackgroundColorButton';
import EditPresentationFrame from './EditPresentationFrame';
import EditThemeButton from './EditThemeButton';
import RemoveButton from './RemoveButton';
import TakeNotesButton from './TakeNotesButton';
import { useSettingsContainerStyles } from './styles';

interface ISlideSettingsProps {
	settings?: SlideSettingsType;
	slideColorDidChange: (color: string) => void;
	presentationFrameEditingEnabled: boolean;
	onEditPresentationFrameClicked: () => void;
	onSlideSettingsChanged: (settings: Partial<SlideSettingsType>) => void;
}

const SlideSettings: React.FC<ISlideSettingsProps> = (props) => {
	const {
		settings,
		slideColorDidChange,
		presentationFrameEditingEnabled,
		onEditPresentationFrameClicked,
		onSlideSettingsChanged,
	} = props;
	const classes = useSettingsContainerStyles();

	return (
		<Box className={classes.container}>
			<TakeNotesButton
				initialNotes={settings?.notes}
				selected={false}
				onSlideSettingsChanged={onSlideSettingsChanged}
			/>
			<Box className={classes.spacer} />
			<EditPresentationFrame
				selected={presentationFrameEditingEnabled}
				onClick={onEditPresentationFrameClicked}
			/>
			<Box className={classes.spacer} />
			<AddTextButton selected={false} />
			<Box className={classes.spacer} />
			<ChangeBackgroundColorButton
				backgroundColor={settings?.color ?? '#000'}
				selected={false}
				onSlideColorChanged={slideColorDidChange}
			/>
			<Box className={classes.spacer} />
			<EditThemeButton selected={false} />
			<Box className={classes.spacer} />
			<RemoveButton />
		</Box>
	);
};

export default SlideSettings;
