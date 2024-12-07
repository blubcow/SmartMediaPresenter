import { Box } from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { usePresentationEditingContext } from '../hooks';
import { i18nNamespace } from '../i18n/i18n';
import { MediaSettingsProvider } from '../providers';
import { PresentationEditingActionIdentifiers } from '../shared/identifiers.enum';
import TopBarDisplayingFilename, {
	ITopBarDisplayingFilenameProps,
} from './components/TopBarDisplayingFilename';
import ActionConfirmationModal from './modals/ActionConfirmationModal';
import MediaSettings from './slideEditing/MediaSettings';
import SlideSettings from './slideEditing/SlideSettings';
import TextSettings from './slideEditing/TextSettings';

interface IEditTopBarProps extends ITopBarDisplayingFilenameProps { }

const EditTopBar: React.FC<IEditTopBarProps> = (props) => {
	const { state, dispatch } = usePresentationEditingContext();
	const { presentation, editingControls, unsavedChanges } = state;
	const [openConfirmation, setOpenConfirmation] = useState<boolean>(false);
	const navigate = useNavigate();
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
					{editingControls === 'media' ? (
						<MediaSettingsProvider>
							<MediaSettings />
						</MediaSettingsProvider>
					) : editingControls === 'text' ? (
						<TextSettings />
					) : (
						<SlideSettings />
					)}
				</Box>
			</TopBarDisplayingFilename>
			<ActionConfirmationModal
				open={openConfirmation}
				secondaryText={t('unsavedChangesLost')}
				onCancel={() => setOpenConfirmation(false)}
				onClose={() => setOpenConfirmation(false)}
				onConfirm={() => {
					setOpenConfirmation(false);
					navigate(-1);
				}}
			/>
		</>
	);
};

export default EditTopBar;
