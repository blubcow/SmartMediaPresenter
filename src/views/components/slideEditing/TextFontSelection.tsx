import React, { useState, useEffect } from 'react';
import { useSystemFonts } from '../../../hooks/useMainProcessMethods';
import { AutoCompleteSelection } from '../../../smpUI/components';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';

const TextFontSelection: React.FC<{}> = () => {
	const { fonts } = useSystemFonts();
	const [font, setFont] = useState<string>('');
	const { t } = useTranslation([i18nNamespace.Presentation]);

	useEffect(() => {
		if (font.length > 0 || fonts.length === 0) return;

		setFont(fonts[0]);
	}, [fonts]);

	return (
		<AutoCompleteSelection
			label={t('font')}
			value={font}
			onValueChanged={(val) => setFont(val)}
			options={fonts}
			style={{ width: '250px' }}
		/>
	);
};

export default TextFontSelection;
