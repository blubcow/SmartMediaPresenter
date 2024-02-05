import React, { useState } from 'react';
import { IconBadge, Row } from '../../../smpUI/components';
import { Add } from '@mui/icons-material';
import { CreateProjectModal } from '../modals';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';

interface IHeaderRowProps {
	ceratePresentationAction: () => void;
	importPresentationAction: () => void;
	enterQuickCreateAction: () => void;
}

const HeaderRow: React.FC<IHeaderRowProps> = (props) => {
	const {
		ceratePresentationAction,
		importPresentationAction,
		enterQuickCreateAction,
	} = props;
	const [modalOpened, setModalOpened] = useState<boolean>(false);
	const { t } = useTranslation([i18nNamespace.Presentation]);

	return (
		<>
			<Row
				sx={{
					bgcolor: 'divider',
					cursor: 'pointer',
				}}
				title={t('createNewPresentation')}
				rootContainerStyle={{ position: 'sticky', top: 0, zIndex: 1 }}
				onClick={() => {
					setModalOpened(true);
				}}
				iconBadge={
					<IconBadge
						icon={Add}
						sx={{ bgcolor: 'background.default', color: 'text.primary' }}
					/>
				}
			/>
			<CreateProjectModal
				open={modalOpened}
				onClose={() => setModalOpened(false)}
				createPresentationAction={ceratePresentationAction}
				enterQuickCreateAction={enterQuickCreateAction}
				importPresentationAction={importPresentationAction}
			/>
		</>
	);
};

export default HeaderRow;
