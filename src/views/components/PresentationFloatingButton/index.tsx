import React, { useState } from 'react';
import { FloatingButton } from '../../../smpUI/components';
import { useTranslation } from 'react-i18next';
import { useDisplays } from '../../../hooks/useMainProcessMethods';
import { Slideshow } from '@mui/icons-material';
import { i18nNamespace } from '../../../i18n/i18n';
import PresentationDispalaySelectionModal from './PresentationDisplaySelectionModal';
import PresentationMode from '../../PresentationMode';
import { useFullScreenHandle } from 'react-full-screen';
import { SinglePresentation } from '../../../shared/types/presentation';
import PresentationFullScreen from '../FullScreen/PresentationFullScreen';

interface IPresentationFloatingButtonProps {
	presentationId: number;
	presentation: SinglePresentation;
}

const PresentationFloatingButton: React.FC<IPresentationFloatingButtonProps> = (
	props
) => {
	const { presentationId, presentation } = props;
	const { displaysAvailable, startPresentationMode } = useDisplays();
	const { t } = useTranslation([i18nNamespace.Presentation]);
	const [open, setOpen] = useState<boolean>(false);
	const [displayAmount, setDisplayAmount] = useState<number>(0);
	const presentationModeHandle = useFullScreenHandle();
	const handle = useFullScreenHandle();

	return (
		<>
			<FloatingButton
				variant='extended'
				color='primary'
				onClick={async () => {
					const c = await displaysAvailable();
					setDisplayAmount(c);
					if (c > 1) {
						if (c > 2) {
							setOpen(true);
						} else {
							startPresentationMode(presentationId, 1);
							presentationModeHandle.enter();
						}
					} else {
						handle.enter();
					}
				}}
			>
				<Slideshow sx={{ mr: 1 }} />
				{t('startPresentation')}
			</FloatingButton>
			<PresentationMode
				handle={presentationModeHandle}
				presentation={presentation}
			/>
			{displayAmount > 2 && (
				<PresentationDispalaySelectionModal
					displaysAmount={displayAmount}
					onDisplaySelected={(displayNumber) => {
						startPresentationMode(presentationId, displayNumber);
						presentationModeHandle.enter();
						setOpen(false);
					}}
					open={open && displayAmount > 2}
					onClose={() => {
						setOpen(false);
					}}
				/>
			)}
			{presentation.slides.length > 0 &&
				presentation.slides[0].media.length > 0 && (
					<PresentationFullScreen
						handle={handle}
						slides={presentation.slides}
					/>
				)}
		</>
	);
};

export default PresentationFloatingButton;
