import React from 'react';
import BaseRow from './BaseRow';
import { Box, IconBadge, Text } from '../../../../smpUI/components';
import { Add } from '@mui/icons-material';

const HeaderRow: React.FC<{}> = () => {
	return (
		<BaseRow
			sx={{
				bgcolor: 'divider',
				position: 'sticky',
			}}
			title='create a new presentation'
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
