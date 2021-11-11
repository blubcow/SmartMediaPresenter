import { initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import authDE from './translations/de/auth.json';
import orderingDE from './translations/de/ordering.json';
import presDE from './translations/de/presentation.json';
import authEN from './translations/en/auth.json';
import orderingEN from './translations/en/ordering.json';
import presEN from './translations/en/presentation.json';
// accessing LanguageDetector via require becauce typings are not available
const LanguageDetector = require('i18next-electron-language-detector');

export enum i18nNamespace {
	Auth = 'auth',
	Ordering = 'ordering',
	Presentation = 'presentation',
}

i18n
	.use(initReactI18next)
	.use(LanguageDetector)
	.init({
		fallbackLng: 'en',
		ns: [
			i18nNamespace.Auth,
			i18nNamespace.Ordering,
			i18nNamespace.Presentation,
		],
		resources: {
			en: { ordering: orderingEN, auth: authEN, presentation: presEN },
			de: { ordering: orderingDE, auth: authDE, presentation: presDE },
		},
	});

export default i18n;
