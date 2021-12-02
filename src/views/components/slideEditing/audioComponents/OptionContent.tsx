import React from 'react';
import OptionRow from './OptionRow';
import { Download, Mic } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../../i18n/i18n';

interface IOptionContentProps {
	onInsertClicked: () => void;
	onRecordClicked: () => void;
}

const OptionContent: React.FC<IOptionContentProps> = (props) => {
	const { onInsertClicked, onRecordClicked } = props;
	const { t } = useTranslation([i18nNamespace.Presentation]);

	return (
		<>
			<OptionRow
				icon={<Download />}
				label={t('importAudio')}
				onClick={onInsertClicked}
			/>
			<OptionRow
				icon={<Mic />}
				label={t('recordAudio')}
				onClick={onRecordClicked}
			/>
		</>
	);
};

export default OptionContent;
