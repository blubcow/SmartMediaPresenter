import React, { PropsWithChildren, createContext } from 'react';
import { useUserSettings } from '../hooks';

export const UserSettingsContext = createContext({});

export const UserSettingsProvider: React.FC<PropsWithChildren<{}>> = ({
	children,
}) => {
	const { userSettings, saveUserSettings, reloadUserSettings } =
		useUserSettings();
	return (
		<UserSettingsContext.Provider
			value={{ userSettings, saveUserSettings, reloadUserSettings }}
		>
			{children}
		</UserSettingsContext.Provider>
	);
};
