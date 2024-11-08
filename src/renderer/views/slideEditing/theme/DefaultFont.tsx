import React from 'react';
import TextFontSelection from '../TextFontSelection';
import SettingsRow from '../../settings/SettingsRow';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';

// TODO: Empty component??

const DefaultFont: React.FC<{}> = () => {
	const { t } = useTranslation([i18nNamespace.Presentation]);

	return (
		<SettingsRow label={t('defaultFont')} node={<TextFontSelection editingTheme />} />
	);
};

export default DefaultFont;
