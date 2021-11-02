import React, { useState } from 'react';
import BaseRow from './BaseRow';
import { IconBadge, Text } from '../../../../smpUI/components';
import { Add } from '@mui/icons-material';
import { CreateProjectModal } from '../../modals';

const HeaderRow: React.FC<{}> = () => {
	const [modalOpened, setModalOpened] = useState<boolean>(false);

	return (
		<>
			<BaseRow
				sx={{
					bgcolor: 'divider',
				}}
				title='create a new presentation'
				rootContainerStyle={{ position: 'sticky', top: 0 }}
				onClick={() => {
					setModalOpened(true);
					console.log('click received');
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
			/>
		</>
	);
};

export default HeaderRow;
