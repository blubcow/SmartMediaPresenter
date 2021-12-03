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
import PresentationFullScreen from '../FullScreen/PresentationFullScreen';
import { useFullScreenHandle } from 'react-full-screen';
import { SinglePresentation } from '../../../shared/types/presentation';

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
		} = state;
		const { t } = useTranslation([i18nNamespace.Presentation]);
		const [
			savedPresentationSuccessAlertOpen,
			setSavedPresentationSuccessAlertOpen,
		] = useState<boolean>(false);
		const handle = useFullScreenHandle();

		const confirmPresentationFrameChanges = () => {
			const settings = {
				...presentation.slides[currentSlide].settings,
			};
			settings.presentationFrame =
				presentationFrameUpdatedSettings ??
				presentation.slides[currentSlide].settings?.presentationFrame;
			const newPresentation = { ...presentation };
			newPresentation.slides[currentSlide].settings = settings;
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
				{presentation.slides.length > 0 &&
					presentation.slides[0].media.length > 0 && (
						<PresentationFullScreen
							handle={handle}
							slides={presentation.slides}
						/>
					)}
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
								// TODO: evaluate result of saving and show according alert
								setSavedPresentationSuccessAlertOpen(true);
							}}
						>
							<Save sx={{ mr: 1 }} />
							{t('save')}
						</FloatingButton>
						<FloatingButton
							variant='extended'
							color='primary'
							onClick={() => {
								handle.enter();
							}}
						>
							<Slideshow sx={{ mr: 1 }} />
							{t('startPresentation')}
						</FloatingButton>
					</>
				)}
			</FloatingButtonContainer>
		);
	};

export default PresentationEditingFloatingButtons;