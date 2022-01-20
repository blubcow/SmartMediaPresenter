import { useContext } from 'react';
import { UserSettingsContext } from '../providers/UserSettingsProvider';
import { UserSettings } from '../shared/types/userSettings';

const useUserSettingsContext = () => {
	const context = useContext(UserSettingsContext) as {
		userSettings: UserSettings;
		saveUserSettings: (settings: UserSettings) => void;
		reloadUserSettings: () => void;
	};

	if (!context)
		throw new Error(
			'useUserSettingsContext hook has to be called inside of an UserSettingsProvider!'
		);

	return context;
};

export default useUserSettingsContext;
