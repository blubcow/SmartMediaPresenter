import { MenuItem } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useUserSettingsContext } from '../../hooks';
import {
	AvailableLanguage,
	AvailableLanguages,
	i18nNamespace,
} from '../../i18n/i18n';
import { SelectionFormControl } from '../../smpUI';
import SettingsRow from './SettingsRow';

const ChangeLanguage: React.FC<{}> = (props) => {
	const { userSettings, saveUserSettings } = useUserSettingsContext();
	const { t } = useTranslation([i18nNamespace.Presentation]);
	return (
		<SettingsRow
			label={t('language')}
			node={
				<SelectionFormControl
					sx={{ minWidth: '90px' }}
					label={t('language')}
					value={userSettings.language}
					// using "value" - "defaultValue" by definition has to be constant through out render cycle 
					onChange={(e) => {
						const lng = e.target.value as AvailableLanguage;
						saveUserSettings({ ...userSettings, language: lng });
					}}
				>
					{AvailableLanguages.map((lng, i) => (
						<MenuItem key={i} value={lng}>{t(lng)}</MenuItem>
					))}
				</SelectionFormControl>
			}
		/>
	);
};

export default ChangeLanguage;
