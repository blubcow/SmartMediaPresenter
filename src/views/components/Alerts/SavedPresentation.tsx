import React from 'react';
import { Snackbar } from '../../../smpUI/components';
import { ISnackbarProps } from '../../../smpUI/components/Snackbar';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';

export const SavedPresentationSuccess: React.FC<ISnackbarProps> = (props) => {
	const { t } = useTranslation([i18nNamespace.Alert]);

	return (
		<Snackbar
			autoHideDuration={5000}
			anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
			severity='success'
			message={t('presSaveSuccess')}
			{...props}
		/>
	);
};
