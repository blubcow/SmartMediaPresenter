import React from 'react';
import OptionRow from './OptionRow';
import { Download, Mic, CloudDownload } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../../i18n/i18n';
import useRemoteUserContext from '../../../../hooks/useRemoteUserContext';

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
