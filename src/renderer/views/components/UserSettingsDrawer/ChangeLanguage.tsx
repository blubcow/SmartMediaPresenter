import React from 'react';
import {
	SelectionPickerOption,
	SelectionPicker,
} from '../../../smpUI/components';
import SettingsRow from '../SettingsRow';
import {
	AvailableLanguage,
	AvailableLanguages,
	i18nNamespace,
} from '../../../i18n/i18n';
import useUserSettingsContext from '../../../hooks/useUserSettingsContext';
import { useTranslation } from 'react-i18next';

const ChangeLanguage: React.FC<{}> = (props) => {
	const { userSettings, saveUserSettings } = useUserSettingsContext();
	const { t } = useTranslation([i18nNamespace.Presentation]);
	return (
		<SettingsRow
			label={t('language')}
			node={
				<SelectionPicker
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
						<SelectionPickerOption key={i} value={lng}>{t(lng)}</SelectionPickerOption>
					))}
				</SelectionPicker>
			}
		/>
	);
};

export default ChangeLanguage;
