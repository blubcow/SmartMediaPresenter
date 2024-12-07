import { Crop54 } from '@mui/icons-material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { usePresentationEditingContext } from '../../hooks';
import { i18nNamespace } from '../../i18n/i18n';
import { PresentationEditingActionIdentifiers } from '../../shared/identifiers.enum';
import EditButtonLabel from './EditButtonLabel';
import EditingButton from './EditingButton';

interface IEditPresentationFrameProps {}

const EditPresentationFrame: React.FC<IEditPresentationFrameProps> = (
	props
) => {
	const { t } = useTranslation([i18nNamespace.Presentation]);
	const { state, dispatch } = usePresentationEditingContext();

	return (
		<EditingButton
			selected={state.editingControls === 'presentationFrame'}
			onClick={() => {
				dispatch({
					type: PresentationEditingActionIdentifiers.editingPresentationFrameStarted,
				});
			}}
			icon={
				<Crop54 sx={{ color: 'text.primary', height: '100%', width: '100%' }} />
			}
			secondaryNode={<EditButtonLabel>{t('editPresFrame')}</EditButtonLabel>}
			{...props}
		/>
	);
};

export default EditPresentationFrame;
