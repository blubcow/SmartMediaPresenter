import React from 'react';
import { Row, IconBadge } from '../../../smpUI/components';
import { Add } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';

interface ISlidesHeaderRowProps {
	addNewSlide: () => void;
}

const SlidesHeaderRow: React.FC<ISlidesHeaderRowProps> = (props) => {
	const { addNewSlide } = props;
	const { t } = useTranslation([i18nNamespace.Presentation]);

	return (
		<Row
			title={t('addNewSlide')}
			height='100px'
			onClick={addNewSlide}
			iconBadge={
				<IconBadge
					icon={Add}
					sx={{ bgcolor: 'background.default', color: 'text.primary' }}
				/>
			}
			rootContainerStyle={{ position: 'sticky', top: 0, zIndex: 1 }}
			sx={{ height: '100px', bgcolor: 'divider' }}
		/>
	);
};

export default SlidesHeaderRow;
