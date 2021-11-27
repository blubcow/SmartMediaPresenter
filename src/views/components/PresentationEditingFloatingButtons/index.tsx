import React from 'react';
import {
	FloatingButtonContainer,
	FloatingButton,
} from '../../../smpUI/components';
import { Check, Close, Save, Slideshow } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import usePresentationEditingContext from '../../../hooks/usePresentationEditingContext';
import { i18nNamespace } from '../../../i18n/i18n';

const PresentationEditingFloatingButtons: React.FC<{}> = () => {
	const { state, dispatch } = usePresentationEditingContext();
	const { t } = useTranslation([i18nNamespace.Presentation]);

	return (
		<FloatingButtonContainer>
			{state.editingControls === 'presentationFrame' ? (
				<>
					<FloatingButton variant='extended' color='primary'>
						<Check sx={{ mr: 1 }} />
						{t('confirm')}
					</FloatingButton>
					<FloatingButton variant='extended' color='secondary'>
						<Close sx={{ mr: 1 }} />
						{t('cancel')}
					</FloatingButton>
				</>
			) : (
				<>
					<FloatingButton variant='extended' color='primary'>
						<Save sx={{ mr: 1 }} />
						{t('save')}
					</FloatingButton>
					<FloatingButton variant='extended' color='primary'>
						<Slideshow sx={{ mr: 1 }} />
						{t('startPresentation')}
					</FloatingButton>
				</>
			)}
		</FloatingButtonContainer>
	);
};

export default FloatingButtonContainer;
