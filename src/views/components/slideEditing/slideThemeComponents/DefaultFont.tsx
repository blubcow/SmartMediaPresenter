import React from 'react';
import TextFontSelection from '../TextFontSelection';
import Row from '../../SettingsRow';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../../i18n/i18n';

const DefaultFont: React.FC<{}> = () => {
	const { t } = useTranslation([i18nNamespace.Presentation]);

	return (
		<Row label={t('defaultFont')} node={<TextFontSelection editingTheme />} />
	);
};

export default DefaultFont;
