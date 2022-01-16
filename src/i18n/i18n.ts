import { initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import authDE from './translations/de/auth.json';
import orderingDE from './translations/de/ordering.json';
import presDE from './translations/de/presentation.json';
import alertDE from './translations/de/alert.json';
import remoteDE from './translations/de/remote.json';
import authEN from './translations/en/auth.json';
import orderingEN from './translations/en/ordering.json';
import presEN from './translations/en/presentation.json';
import alertEN from './translations/en/alert.json';
import remoteEN from './translations/en/remote.json';

export enum i18nNamespace {
	Auth = 'auth',
	Ordering = 'ordering',
	Presentation = 'presentation',
	Alert = 'alert',
	Remote = 'remote',
}

export const AvailableLanguages = ['auto', 'en', 'de'] as const;
export type AvailableLanguage = typeof AvailableLanguages[number];

i18n.use(initReactI18next).init({
	lng: navigator.language.split('_')[0],
	fallbackLng: 'en',
	ns: [
		i18nNamespace.Auth,
		i18nNamespace.Ordering,
		i18nNamespace.Presentation,
		i18nNamespace.Remote,
	],
	resources: {
		en: {
			ordering: orderingEN,
			auth: authEN,
			presentation: presEN,
			alert: alertEN,
			remote: remoteEN,
		},
		de: {
			ordering: orderingDE,
			auth: authDE,
			presentation: presDE,
			alert: alertDE,
			remote: remoteDE,
		},
	},
});

export default i18n;
