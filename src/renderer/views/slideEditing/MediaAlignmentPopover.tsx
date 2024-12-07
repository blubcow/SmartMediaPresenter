import { Box, Button, ButtonGroup, Popover, PopoverProps } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../i18n/i18n';
import {
	MediaAlignment
} from '../../shared/presentation.interface';
import { EditableText } from '../../smpUI';

interface IMediaAlignmentPopoverProps extends PopoverProps {
	alignment?: MediaAlignment;
	handleAlignment: (alignment: MediaAlignment) => void;
}

const MediaAlignemntPopover: React.FC<IMediaAlignmentPopoverProps> = (
	props
) => {
	const { alignment, handleAlignment, ...popoverProps } = props;
	const { t } = useTranslation([i18nNamespace.Presentation]);

	return (
		<Popover {...popoverProps}>
			<Box
				sx={{
					padding: 2,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
				}}
			>
				<EditableText variant='h6' fontWeight='bold'>
					{t('align')}
				</EditableText>
				<Box sx={{ paddingTop: 2, paddingBottom: 2 }}>
					<Button
						variant='contained'
						size='small'
						color={!alignment || alignment === 'auto' ? 'secondary' : 'primary'}
						onClick={() => handleAlignment('auto')}
					>
						{t('auto')}
					</Button>
				</Box>
				<ButtonGroup variant='contained'>
					<Button
						sx={{ minWidth: '80px' }}
						size='small'
						onClick={() => handleAlignment('left')}
						color={alignment === 'left' ? 'secondary' : 'primary'}
					>
						{t('left')}
					</Button>
					<Button
						sx={{ minWidth: '80px' }}
						size='small'
						color={alignment === 'center' ? 'secondary' : 'primary'}
						onClick={() => handleAlignment('center')}
					>
						{t('center')}
					</Button>
					<Button
						sx={{ minWidth: '80px' }}
						size='small'
						onClick={() => handleAlignment('right')}
						color={alignment === 'right' ? 'secondary' : 'primary'}
					>
						{t('right')}
					</Button>
				</ButtonGroup>
			</Box>
		</Popover>
	);
};

export default MediaAlignemntPopover;
