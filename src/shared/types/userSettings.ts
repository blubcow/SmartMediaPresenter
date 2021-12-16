import { AvailableLanguage } from '../../i18n/i18n';

export type preferredTheme = 'auto' | 'dark' | 'light';

export interface UserSettings {
	theme: preferredTheme;
	language: AvailableLanguage;
}
