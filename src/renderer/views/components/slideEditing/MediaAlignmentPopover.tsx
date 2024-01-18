import React from 'react';
import { Popover, Box, Button, Text } from '../../../smpUI/components';
import { IPopoverProps } from '../../../smpUI/components/Popover';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';
import { ButtonGroup } from '@mui/material';
import {
	MediaAlignment,
	SinglePresentation,
} from '../../../shared/types/presentation';

interface IMediaAlignmentPopoverProps extends IPopoverProps {
	alignment?: MediaAlignment;
	handleAlignment: (alignment: MediaAlignment) => void;
}

const MediaAlignemntPopover: React.FC<IMediaAlignmentPopoverProps> = (
	props
) => {
	const { alignment, handleAlignment } = props;
	const { t } = useTranslation([i18nNamespace.Presentation]);

	return (
		<Popover {...props}>
			<Box
				sx={{
					padding: 2,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
				}}
			>
				<Text variant='h6' fontWeight='bold'>
					{t('align')}
				</Text>
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
						minWidth='80px'
						size='small'
						onClick={() => handleAlignment('left')}
						color={alignment === 'left' ? 'secondary' : 'primary'}
					>
						{t('left')}
					</Button>
					<Button
						minWidth='80px'
						size='small'
						color={alignment === 'center' ? 'secondary' : 'primary'}
						onClick={() => handleAlignment('center')}
					>
						{t('center')}
					</Button>
					<Button
						minWidth='80px'
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
