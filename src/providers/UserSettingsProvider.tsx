import React, { PropsWithChildren, createContext, useState } from 'react';
import { useUserSettings } from '../hooks/useMainProcessMethods';

export const UserSettingsContext = createContext({});

const UserSettingsProvider: React.FC<PropsWithChildren<{}>> = ({
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

export default UserSettingsProvider;
