import React, { useState, useEffect } from 'react';
import {
	FloatingButtonContainer,
	FloatingButton,
} from '../../../smpUI/components';
import { Check, Close, Save, Slideshow } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import usePresentationEditingContext from '../../../hooks/usePresentationEditingContext';
import { i18nNamespace } from '../../../i18n/i18n';
import { PresentationEditingActionIdentifiers } from '../../../types/identifiers';
import { SavedPresentationSuccess } from '../Alerts/SavedPresentation';
import { SinglePresentation } from '../../../shared/types/presentation';
import PresentationFloatingButton from '../PresentationFloatingButton';

interface IPresentationEditingFloatingButtons {
	onSave: (presentation: SinglePresentation) => void;
}

const PresentationEditingFloatingButtons: React.FC<IPresentationEditingFloatingButtons> =
	(props) => {
		const { onSave } = props;
		const { state, dispatch } = usePresentationEditingContext();
		const {
			editingControls,
			presentation,
			currentSlide,
			presentationFrameUpdatedSettings,
			presentationId,
		} = state;
		const { t } = useTranslation([i18nNamespace.Presentation]);
		const [
			savedPresentationSuccessAlertOpen,
			setSavedPresentationSuccessAlertOpen,
		] = useState<boolean>(false);

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
				<SavedPresentationSuccess
					open={savedPresentationSuccessAlertOpen}
					onClose={() => setSavedPresentationSuccessAlertOpen(false)}
				/>
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
								// TODO: evaluate result of saving and show according alert
								setSavedPresentationSuccessAlertOpen(true);
							}}
						>
							<Save sx={{ mr: 1 }} />
							{t('save')}
						</FloatingButton>
						<PresentationFloatingButton
							presentationId={presentationId}
							presentation={presentation}
						/>
					</>
				)}
			</FloatingButtonContainer>
		);
	};

export default PresentationEditingFloatingButtons;
