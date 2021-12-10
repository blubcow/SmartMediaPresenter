import React from 'react';
import { ButtonGroup } from '@mui/material';
import { Box, Card, Button } from '../../../smpUI/components';
import {
	AlignHorizontalCenter,
	AlignHorizontalLeft,
	AlignHorizontalRight,
} from '@mui/icons-material';

const TextAliginmentButton: React.FC<{}> = () => {
	return (
		<Box sx={{ display: 'flex', alignItems: 'center' }}>
			<Card elevation={10}>
				<ButtonGroup variant='contained' color='info'>
					<Button minWidth={'60px'}>
						<AlignHorizontalLeft />
					</Button>
					<Button minWidth={'60px'}>
						<AlignHorizontalCenter />
					</Button>
					<Button minWidth={'60px'}>
						<AlignHorizontalRight />
					</Button>
				</ButtonGroup>
			</Card>
		</Box>
	);
};

export default TextAliginmentButton;
