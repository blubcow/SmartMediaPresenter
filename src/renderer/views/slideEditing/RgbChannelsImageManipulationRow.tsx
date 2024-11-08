import React from 'react';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../i18n/i18n';
import { Tune } from '@mui/icons-material';
import SettingsRow from '../settings/SettingsRow';

interface IRgbChannelsImageManipulationRowProps {
	onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const RgbChannelsImageManipulationRow: React.FC<IRgbChannelsImageManipulationRowProps> =
	(props) => {
		const { onClick } = props;
		const { t } = useTranslation([i18nNamespace.Presentation]);

		return (
			<SettingsRow
				label={t('adjustColorChannels')}
				node={<Tune />}
				onClick={onClick}
			/>
		);
	};

export default RgbChannelsImageManipulationRow;
