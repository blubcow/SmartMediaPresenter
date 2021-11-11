import React, { useState } from 'react';
import { IconBadge, Text, Row } from '../../../smpUI/components';
import { Add } from '@mui/icons-material';
import { CreateProjectModal } from '../modals';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';

interface IHeaderRowProps {
	ceratePresentationAction: () => any;
	enterQuickCreateAction: () => any;
}

const HeaderRow: React.FC<IHeaderRowProps> = (props) => {
	const { ceratePresentationAction, enterQuickCreateAction } = props;
	const [modalOpened, setModalOpened] = useState<boolean>(false);
	const { t } = useTranslation([i18nNamespace.Presentation]);

	return (
		<>
			<Row
				sx={{
					bgcolor: 'divider',
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
			/>
		</>
	);
};

export default HeaderRow;
