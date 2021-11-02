import React from 'react';
import BaseRow from './BaseRow';
import { Box, IconBadge, Text } from '../../../../smpUI/components';
import { Add } from '@mui/icons-material';

const HeaderRow: React.FC<{}> = () => {
	return (
		<BaseRow
			sx={{
				bgcolor: 'divider',
			}}
			title='create a new presentation'
			rootContainerStyle={{ position: 'sticky', top: 0 }}
			iconBadge={
				<IconBadge
					icon={Add}
					sx={{ bgcolor: 'background.default', color: 'text.primary' }}
				/>
			}
		/>
	);
};

export default HeaderRow;
