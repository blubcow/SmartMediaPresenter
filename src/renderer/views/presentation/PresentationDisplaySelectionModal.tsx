import React from 'react';
import Modal from '../../smpUI/Modal';
import EditableText from '../../smpUI/EditableText';
import { Box} from '@mui/material';
import { IModalProps } from '../../smpUI/Modal';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../i18n/i18n';

interface IPresentationDispalaySelectionModalProps extends IModalProps {
	onDisplaySelected: (display: number) => void;
	displaysAmount: number;
}

const PresentationDispalaySelectionModal: React.FC<IPresentationDispalaySelectionModalProps> =
	(props) => {
		const { onDisplaySelected, displaysAmount, ...modalProps } = props;
		const { t } = useTranslation([i18nNamespace.Presentation]);

		return (
			<Modal {...modalProps}>
				<Box
					sx={{
						display: 'flex',
						padding: 2,
						alignItems: 'center',
						flexDirection: 'column',
						textAlign: 'center',
					}}
				>
					<EditableText variant='h5' fontWeight='bold'>
						{t('multipleDisplaysAvailable')}
					</EditableText>
					<Box sx={{ paddingTop: 1 }}>
						<EditableText>{t('selectDisplay')}</EditableText>
					</Box>
					<Box sx={{ display: 'flex', paddingTop: 3 }}>
						{Array(displaysAmount - 1)
							.fill(0)
							.map((_, i) => (
								<Box
									sx={{
										marginLeft: i !== 0 ? 1 : 0,
										height: '80px',
										width: '135px',
										display: 'flex',
										flexDirection: 'column',
										justifyContent: 'center',
										alignItems: 'center',
										cursor: 'pointer',
										bgcolor: 'background.default',
										borderRadius: 1,
									}}
									key={i}
									onClick={() => {
										onDisplaySelected(i + 1);
									}}
								>
									<EditableText>{t('display')}</EditableText>
									<EditableText>{i + 2}</EditableText>
								</Box>
							))}
					</Box>
				</Box>
			</Modal>
		);
	};

export default PresentationDispalaySelectionModal;
