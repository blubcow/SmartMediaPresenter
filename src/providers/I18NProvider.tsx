import React, { PropsWithChildren, useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import useUserSettingsContext from '../hooks/useUserSettingsContext';
import i18n from '../i18n/i18n';

const I18NProvider: React.FC<PropsWithChildren<{}>> = (props) => {
	const { userSettings } = useUserSettingsContext();

	useEffect(() => {
		const languageCode =
			userSettings.language === 'auto'
				? navigator.language.split('_')[0]
				: userSettings.language;
		i18n.changeLanguage(languageCode);
	}, [userSettings.language]);

	return <I18nextProvider i18n={i18n}>{props.children}</I18nextProvider>;
};

export default I18NProvider;
