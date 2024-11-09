import React from 'react';
import Modal from '../../smpUI/Modal';
import EditableText from '../../smpUI/EditableText';
import { Box} from '@mui/material';
import { IModalProps } from '../../smpUI/Modal';
import { DesktopWindows, Cloud } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../i18n/i18n';
import { createStyles, makeStyles } from '@mui/styles';
import { Theme } from '@mui/material';

const useLocalOrRemoteModalStyles = makeStyles((theme: Theme) =>
	createStyles({
		container: {
			display: 'flex',
			flexDirection: 'column',
			gap: theme.spacing(3),
			alignItems: 'center',
			justifyContent: 'center',
		},
		btns: {
			display: 'flex',
			gap: theme.spacing(3),
		},
		btn: {
			padding: theme.spacing(1),
			width: '100px',
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			justifyContent: 'center',
			gap: theme.spacing(1),
			textAlign: 'center',
			borderRadius: theme.shape.borderRadius,
			transition: 'box-shadow 0.2s ease',
			boxShadow: theme.shadows[5],
			cursor: 'pointer',
			'&:hover': {
				boxShadow: theme.shadows[20],
			},
		},
	})
);

type localOrRemoteSelection = 'local' | 'remote';

interface ILocalOrRemoteModalProps extends IModalProps {
	onSelection: (selection: localOrRemoteSelection) => void;
}

const LocalOrRemoteModal: React.FC<ILocalOrRemoteModalProps> = (props) => {
	const { onSelection, ...modalProps } = props;
	const classes = useLocalOrRemoteModalStyles();
	const { t } = useTranslation([i18nNamespace.Remote]);

	const handleSelection = (selection: localOrRemoteSelection) => {
		onSelection(selection);
		if (props.onClose) props.onClose({}, 'backdropClick');
	};

	return (
		<Modal {...modalProps}>
			<Box className={classes.container}>
				<EditableText variant='h6' fontWeight={800}>
					{t('chooseLocalOrRemote')}
				</EditableText>
				<Box className={classes.btns}>
					<Box className={classes.btn} onClick={() => handleSelection('local')}>
						<DesktopWindows sx={{ color: 'text.prmary', fontSize: '50px' }} />
						<EditableText fontWeight={700}>{t('local')}</EditableText>
					</Box>
					<Box
						className={classes.btn}
						onClick={() => handleSelection('remote')}
					>
						<Cloud sx={{ color: 'text.prmary', fontSize: '50px' }} />
						<EditableText fontWeight={700}>{t('cloud')}</EditableText>
					</Box>
				</Box>
			</Box>
		</Modal>
	);
};

export default LocalOrRemoteModal;
