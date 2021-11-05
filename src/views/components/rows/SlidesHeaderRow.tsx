import React from 'react';
import { Row, IconBadge } from '../../../smpUI/components';
import { Add } from '@mui/icons-material';

interface ISlidesHeaderRowProps {
	addNewSlide: () => void;
}

const SlidesHeaderRow: React.FC<ISlidesHeaderRowProps> = (props) => {
	const { addNewSlide } = props;

	return (
		<Row
			title='add new slide'
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
