import React from 'react';
import { Modal, Box, Text } from '../../../smpUI/components';
import { IModalProps } from '../../../smpUI/components/Modal';
import { useLocalOrRemoteModalStyles } from './styles';
import { DesktopWindows, Cloud } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';

type localOrRemoteSelection = 'local' | 'remote';

interface ILocalOrRemoteModalProps extends IModalProps {
	onSelection: (selection: localOrRemoteSelection) => void;
}

const LocalOrRemoteModal: React.FC<ILocalOrRemoteModalProps> = (props) => {
	const { onSelection } = props;
	const classes = useLocalOrRemoteModalStyles();
	const { t } = useTranslation([i18nNamespace.Remote]);

	const handleSelection = (selection: localOrRemoteSelection) => {
		onSelection(selection);
		if (props.onClose) props.onClose({}, 'backdropClick');
	};

	return (
		<Modal {...props}>
			<Box className={classes.container}>
				<Text variant='h6' fontWeight={800}>
					{t('chooseLocalOrRemote')}
				</Text>
				<Box className={classes.btns}>
					<Box className={classes.btn} onClick={() => handleSelection('local')}>
						<DesktopWindows sx={{ color: 'text.prmary', fontSize: '50px' }} />
						<Text fontWeight={700}>{t('local')}</Text>
					</Box>
					<Box
						className={classes.btn}
						onClick={() => handleSelection('remote')}
					>
						<Cloud sx={{ color: 'text.prmary', fontSize: '50px' }} />
						<Text fontWeight={700}>{t('cloud')}</Text>
					</Box>
				</Box>
			</Box>
		</Modal>
	);
};

export default LocalOrRemoteModal;
