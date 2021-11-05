import React, { useState } from 'react';
import { IconBadge, Text, Row } from '../../../smpUI/components';
import { Add } from '@mui/icons-material';
import { CreateProjectModal } from '../modals';

interface IHeaderRowProps {
	ceratePresentationAction: () => any;
}

const HeaderRow: React.FC<IHeaderRowProps> = (props) => {
	const { ceratePresentationAction } = props;
	const [modalOpened, setModalOpened] = useState<boolean>(false);

	return (
		<>
			<Row
				sx={{
					bgcolor: 'divider',
				}}
				title='create a new presentation'
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
			/>
		</>
	);
};

export default HeaderRow;
