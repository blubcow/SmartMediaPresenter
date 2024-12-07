import { CloudDownload, Download, Mic } from '@mui/icons-material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';
import OptionRow from './OptionRow';
import { useRemoteUserContext } from '../../../hooks';

interface IOptionContentProps {
	onInsertClicked: () => void;
	onRecordClicked: () => void;
	onCloudClicked: () => void;
}

const OptionContent: React.FC<IOptionContentProps> = (props) => {
	const { onInsertClicked, onRecordClicked, onCloudClicked } = props;
	const { t } = useTranslation([i18nNamespace.Presentation]);
	const { userLoggedIn } = useRemoteUserContext();

	return (
		<>
			<OptionRow
				icon={<Download />}
				label={t('importAudio')}
				onClick={onInsertClicked}
			/>
			{userLoggedIn && (
				<OptionRow
					icon={<CloudDownload />}
					label={t('chooseCloud')}
					onClick={onCloudClicked}
				/>
			)}
			<OptionRow
				icon={<Mic />}
				label={t('recordAudio')}
				onClick={onRecordClicked}
			/>
		</>
	);
};

export default OptionContent;
