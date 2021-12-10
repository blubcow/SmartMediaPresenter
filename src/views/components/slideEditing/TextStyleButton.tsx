import React from 'react';
import { ButtonGroup } from '@mui/material';
import { Box, Card, Button } from '../../../smpUI/components';
import { FormatItalic, FormatBold } from '@mui/icons-material';

const TextStyleButton: React.FC<{}> = () => {
	return (
		<Box sx={{ display: 'flex', alignItems: 'center' }}>
			<Card elevation={10}>
				<ButtonGroup variant='contained' color='info'>
					<Button minWidth={'60px'}>
						<FormatItalic />
					</Button>
					<Button minWidth={'60px'}>
						<FormatBold />
					</Button>
				</ButtonGroup>
			</Card>
		</Box>
	);
};

export default TextStyleButton;
