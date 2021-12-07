import React, { useState } from 'react';
import usePresentationEditingContext from '../../hooks/usePresentationEditingContext';
import { Box } from '../../smpUI/components';
import { PresentationEditingActionIdentifiers } from '../../types/identifiers';
import TopBarDisplayingFilename, {
	ITopBarDisplayingFilenameProps,
} from '../components/appBars/TopBarDisplayingFilename';
import MediaSettings from '../components/slideEditing/MediaSettings';
import SlideSettings from '../components/slideEditing/SlideSettings';
import ActionConfirmationModal from '../components/modals/ActionConfirmationModal';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../i18n/i18n';

interface IEditTopBarProps extends ITopBarDisplayingFilenameProps {}

const EditTopBar: React.FC<IEditTopBarProps> = (props) => {
	const { state, dispatch } = usePresentationEditingContext();
	const { presentation, editingControls, unsavedChanges } = state;
	const [openConfirmation, setOpenConfirmation] = useState<boolean>(false);
	const history = useHistory();
	const { t } = useTranslation([i18nNamespace.Presentation]);

	return (
		<>
			<TopBarDisplayingFilename
				{...props}
				withFixedHeight={'120px'}
				onGoBack={
					unsavedChanges
						? () => {
								setOpenConfirmation(true);
						  }
						: undefined
				}
				onFilenameChanged={(filename) => {
					const newPresentation = { ...presentation };
					newPresentation.name = filename;
					dispatch({
						type: PresentationEditingActionIdentifiers.presentationSettingsUpdated,
						payload: { presentation: newPresentation },
					});
				}}
			>
				<Box
					sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}
				>
					{editingControls === 'media' ? <MediaSettings /> : <SlideSettings />}
				</Box>
			</TopBarDisplayingFilename>
			<ActionConfirmationModal
				open={openConfirmation}
				secondaryText={t('unsavedChangesLost')}
				onCancel={() => setOpenConfirmation(false)}
				onClose={() => setOpenConfirmation(false)}
				onConfirm={() => {
					setOpenConfirmation(false);
					history.goBack();
				}}
			/>
		</>
	);
};

export default EditTopBar;
