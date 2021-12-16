import React from 'react';
import { ButtonGroup } from '@mui/material';
import { Button } from '../../../smpUI/components';
import SettingsRow from '../SettingsRow';
import useUserSettingsContext from '../../../hooks/useUserSettingsContext';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';
import { AutoAwesome, DarkMode, LightMode } from '@mui/icons-material';
import { preferredTheme } from '../../../shared/types/userSettings';

const ChangeTheme: React.FC<{}> = (props) => {
	const { userSettings, saveUserSettings } = useUserSettingsContext();
	const { t } = useTranslation([i18nNamespace.Presentation]);
	const handleThemeChange = (theme: preferredTheme) => {
		saveUserSettings({ ...userSettings, theme: theme });
	};
	return (
		<SettingsRow
			label={t('theme')}
			node={
				<ButtonGroup variant='contained'>
					<Button
						minWidth='40px'
						sx={{
							bgcolor:
								userSettings.theme === 'auto' ? 'secondary.main' : undefined,
						}}
						onClick={() => handleThemeChange('auto')}
					>
						<AutoAwesome />
					</Button>
					<Button
						minWidth='40px'
						sx={{
							bgcolor:
								userSettings.theme === 'dark' ? 'secondary.main' : undefined,
						}}
						onClick={() => handleThemeChange('dark')}
					>
						<DarkMode />
					</Button>
					<Button
						minWidth='40px'
						sx={{
							bgcolor:
								userSettings.theme === 'light' ? 'secondary.main' : undefined,
						}}
						onClick={() => handleThemeChange('light')}
					>
						<LightMode />
					</Button>
				</ButtonGroup>
			}
		/>
	);
};

export default ChangeTheme;
