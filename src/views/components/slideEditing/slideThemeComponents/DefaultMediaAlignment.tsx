import React, { useState } from 'react';
import Row from '../../SettingsRow';
import { Text } from '../../../../smpUI/components';
import usePresentationEditingContext from '../../../../hooks/usePresentationEditingContext';
import { PresentationEditingActionIdentifiers } from '../../../../types/identifiers';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../../i18n/i18n';
import MediaAlignemntPopover from '../MediaAlignmentPopover';
import {
	MediaAlignment,
	SinglePresentation,
} from '../../../../shared/types/presentation';

const DefaultMediaAlignemnt: React.FC<{}> = () => {
	const { state, dispatch } = usePresentationEditingContext();
	const { presentation } = state;
	const [anchorElement, setAnchorElement] = useState<
		HTMLDivElement | undefined
	>(undefined);
	const { t } = useTranslation([i18nNamespace.Presentation]);

	const handleClose = () => setAnchorElement(undefined);

	const handleAlignment = (alignment?: MediaAlignment) => {
		const newPresentation: SinglePresentation = JSON.parse(
			JSON.stringify(presentation)
		);
		newPresentation.theme = {
			...newPresentation.theme,
			defaultMediaAlignment: alignment,
		};
		dispatch({
			type: PresentationEditingActionIdentifiers.presentationSettingsUpdated,
			payload: { presentation: newPresentation },
		});
	};

	return (
		<>
			<Row
				label={t('defaultMediaAlignment')}
				node={
					<Text>
						{t(
							presentation.theme?.defaultMediaAlignment
								? presentation.theme!.defaultMediaAlignment!
								: 'auto'
						)}
					</Text>
				}
				onClick={(e) => setAnchorElement(e.currentTarget)}
			/>
			<MediaAlignemntPopover
				open={!!anchorElement}
				onClose={handleClose}
				anchorEl={anchorElement}
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'center',
				}}
				transformOrigin={{
					vertical: 'bottom',
					horizontal: 'center',
				}}
				alignment={presentation.theme?.defaultMediaAlignment}
				handleAlignment={handleAlignment}
			/>
		</>
	);
};

export default DefaultMediaAlignemnt;
