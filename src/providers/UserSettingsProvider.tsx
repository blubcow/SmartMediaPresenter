import React, { PropsWithChildren, createContext, useState } from 'react';
import { useUserSettings } from '../hooks/useMainProcessMethods';

export const UserSettingsContext = createContext({});

const UserSettingsProvider: React.FC<PropsWithChildren<{}>> = ({
	children,
}) => {
	const { userSettings, saveUserSettings } = useUserSettings();
	return (
		<UserSettingsContext.Provider value={{ userSettings, saveUserSettings }}>
			{children}
		</UserSettingsContext.Provider>
	);
};

export default UserSettingsProvider;
