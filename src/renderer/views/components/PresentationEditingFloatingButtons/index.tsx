import React, { useState, useEffect } from 'react';
import {
	FloatingButtonContainer,
	FloatingButton,
	Snackbar,
} from '../../../smpUI/components';
import { Check, Close, Save } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import usePresentationEditingContext from '../../../hooks/usePresentationEditingContext';
import { i18nNamespace } from '../../../i18n/i18n';
import { PresentationEditingActionIdentifiers } from '../../../types/identifiers';
import { SinglePresentation } from '../../../shared/types/presentation';
import PresentationFloatingButton from '../PresentationFloatingButton';

interface IPresentationEditingFloatingButtons {
	onSave: (presentation: SinglePresentation) => void;
}

const PresentationEditingFloatingButtons: React.FC<
	IPresentationEditingFloatingButtons
> = (props) => {
	const { onSave } = props;
	const { state, dispatch } = usePresentationEditingContext();
	const {
		editingControls,
		presentation,
		currentSlide,
		presentationFrameUpdatedSettings,
		presentationId,
	} = state;
	const { t } = useTranslation([i18nNamespace.Presentation, i18nNamespace.Alert]);

	const [saveSuccessAlert, setSaveSuccessAlert] = useState<boolean>(false);

	const confirmPresentationFrameChanges = () => {
		const newPresentation = { ...presentation };
		newPresentation.slides = [...presentation.slides];
		newPresentation.slides[currentSlide] = {
			...presentation.slides[currentSlide],
			settings: {
				...presentation.slides[currentSlide].settings,
				presentationFrame:
					presentationFrameUpdatedSettings ??
					presentation.slides[currentSlide].settings?.presentationFrame,
			},
		};

		dispatch({
			type: PresentationEditingActionIdentifiers.presentationSettingsUpdated,
			payload: { presentation: newPresentation },
		});
		dispatch({
			type: PresentationEditingActionIdentifiers.editingSlideStated,
		});
	};

	useEffect(() => {
		if (editingControls !== 'presentationFrame') return;
		const handleEnter = (e: KeyboardEvent) => {
			if (e.key === 'Enter') confirmPresentationFrameChanges();
		};
		document.addEventListener('keydown', handleEnter);

		return () => document.removeEventListener('keydown', handleEnter);
	}, [
		presentation,
		currentSlide,
		presentationFrameUpdatedSettings,
		dispatch,
		editingControls,
	]);

	return (
		<FloatingButtonContainer>

			<Snackbar 
				open={saveSuccessAlert}
				onClose={() => setSaveSuccessAlert(false)}
				severity='success'
				message={t('presSaveSuccess', {ns: i18nNamespace.Alert})}/>

			{state.editingControls === 'presentationFrame' ? (
				<>
					<FloatingButton
						variant='extended'
						color='primary'
						onClick={confirmPresentationFrameChanges}
					>
						<Check sx={{ mr: 1 }} />
						{t('confirm')}
					</FloatingButton>
					<FloatingButton
						variant='extended'
						color='secondary'
						onClick={() => {
							dispatch({
								type: PresentationEditingActionIdentifiers.presentationFrameUpdated,
								payload: { presentationFrameUpdatedSettings: undefined },
							});
							dispatch({
								type: PresentationEditingActionIdentifiers.editingSlideStated,
							});
						}}
					>
						<Close sx={{ mr: 1 }} />
						{t('cancel')}
					</FloatingButton>
				</>
			) : (
				<>
					<FloatingButton
						variant='extended'
						color='primary'
						onClick={() => {
							onSave(presentation);
							dispatch({
								type: PresentationEditingActionIdentifiers.savePresentationChanges,
							});
							setSaveSuccessAlert(true);
						}}
					>
						<Save sx={{ mr: 1 }} />
						{t('save')}
					</FloatingButton>
					<PresentationFloatingButton
						presentationId={presentationId}
						presentation={presentation}
						initialSlide={currentSlide}
					/>
				</>
			)}
		</FloatingButtonContainer>
	);
};

export default PresentationEditingFloatingButtons;
