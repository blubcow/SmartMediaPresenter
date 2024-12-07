import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePresentationEditingContext } from '../../../hooks';
import { i18nNamespace } from '../../../i18n/i18n';
import { PresentationEditingActionIdentifiers } from '../../../shared/identifiers.enum';
import {
	MediaAlignment,
	SinglePresentation,
} from '../../../shared/presentation.interface';
import { EditableText } from '../../../smpUI/EditableText';
import SettingsRow from '../../settings/SettingsRow';
import MediaAlignemntPopover from '../MediaAlignmentPopover';

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
			<SettingsRow
				label={t('defaultMediaAlignment')}
				node={
					<EditableText>
						{t(
							presentation.theme?.defaultMediaAlignment
								? presentation.theme!.defaultMediaAlignment!
								: 'auto'
						)}
					</EditableText>
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
