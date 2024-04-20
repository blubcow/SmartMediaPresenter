import React, { useEffect, useRef, useState } from 'react';
import EditingButton from './EditingButton';
import { VerticalAlignCenter } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';
import EditButtonLabel from './EditButtonLabel';
import usePresentationEditingContext from '../../../hooks/usePresentationEditingContext';
import { PresentationEditingActionIdentifiers } from '../../../types/identifiers';
import { useMediaSettingsContext } from '../../../providers/MediaSettingsProvider';
import AutoAlignmentPopover from './AutoAlignmentPopover';

interface IAutoAlignmentButtonProps { }

const AutoAlignmentButton: React.FC<IAutoAlignmentButtonProps> = (props) => {
	const { t } = useTranslation([i18nNamespace.Presentation]);
	const { dispatch } = usePresentationEditingContext();
	const { ref: mediaSettingsRef } = useMediaSettingsContext();

	const isActive = useRef<boolean>(false);
	const anchorElRef = useRef<HTMLDivElement>(null);
	const [highlighted, setHighlighted] = useState<boolean>(false);
	//const [isLoading, setIsLoading] = useState<boolean>(false);

	useEffect(() => {
		return destroy; // on Close
	}, []);

	const destroy = () => {
		if (mediaSettingsRef.current) {
			mediaSettingsRef.current.removeEventListener("mousedown", onMediaSettingsClicked, true);
		}
		isActive.current = false;
	}
	
	// Called on EditingButton click
	const activate = () => {
		if (mediaSettingsRef.current) {
			mediaSettingsRef.current.addEventListener("mousedown", onMediaSettingsClicked, true);
		}
		isActive.current = true;
		dispatch({ type: PresentationEditingActionIdentifiers.selectSecondMedia });
	};

	// Called on EditingButton click
	const deActivate = () => {
		destroy();
		dispatch({ type: PresentationEditingActionIdentifiers.editingMediaStarted });
	};

	// Any other button on top edit navigation clicked
	const onMediaSettingsClicked = (e: MouseEvent) => {
		if (anchorElRef.current && !anchorElRef.current.contains(e.target as Node)) {
			deActivate();
		}
	}

	return (
		<>
			<EditingButton
				highlighted={ highlighted }
				icon={
					<VerticalAlignCenter sx={{ color: 'text.primary', height: '100%', width: '100%' }} />
				}
				secondaryNode={
					<EditButtonLabel>{t('autoAlignment.editButtonLabel')}</EditButtonLabel>
				}
				selected={isActive.current}
				onClick={(e) => isActive.current ? deActivate() : activate()}
				ref={anchorElRef}
				{...props}
			/>
			<AutoAlignmentPopover
				open={isActive.current}
				anchorEl={anchorElRef.current}
				//onLoading={setIsLoading}
				onProcessed={(isProcessed:boolean) => { setHighlighted(isProcessed); }}
				onFileSaved={() => { isActive.current = false; }}
			/>
		</>
	);
};

export default AutoAlignmentButton;
