import React, { useState, useEffect } from 'react';
import EditingButton from './EditingButton';
import { Popover, Box, Button, Text } from '../../../smpUI/components';
import { CropOriginal } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';
import EditButtonLabel from './EditButtonLabel';
import usePresentationEditingContext from '../../../hooks/usePresentationEditingContext';
import { ButtonGroup } from '@mui/material';
import { MediaAlignment } from '../../../shared/types/presentation';
import { PresentationEditingActionIdentifiers } from '../../../types/identifiers';

interface IAlignMediaButtonProps {}

const AlignMediaButton: React.FC<IAlignMediaButtonProps> = (props) => {
	const { t } = useTranslation([i18nNamespace.Presentation]);
	const { state, dispatch } = usePresentationEditingContext();
	const { presentation, currentSlide, activeMedia } = state;
	const [anchorElement, setAnchorElement] = useState<
		HTMLDivElement | undefined
	>(undefined);

	const handleClose = () => {
		setAnchorElement(undefined);
	};

	const handleAlignment = (align?: MediaAlignment) => {
		const newPresentation = JSON.parse(JSON.stringify(presentation));
		newPresentation.slides[currentSlide].media[activeMedia!].settings = {
			...newPresentation.slides[currentSlide].media[activeMedia!].settings,
			alignment: align,
		};
		dispatch({
			type: PresentationEditingActionIdentifiers.presentationSettingsUpdated,
			payload: { presentation: newPresentation },
		});
	};

	return (
		<>
			<EditingButton
				highlighted={presentation.slides[currentSlide].playback !== undefined}
				icon={
					<CropOriginal
						sx={{ color: 'text.primary', height: '100%', width: '100%' }}
					/>
				}
				secondaryNode={<EditButtonLabel>{t('align')}</EditButtonLabel>}
				selected={!!anchorElement}
				onClick={(e) => {
					setAnchorElement(e.currentTarget);
				}}
				{...props}
			/>
			<Popover
				open={!!anchorElement}
				onClose={handleClose}
				anchorEl={anchorElement}
			>
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
							color={
								!presentation.slides[currentSlide].media[activeMedia!].settings
									?.alignment
									? 'secondary'
									: 'primary'
							}
							onClick={() => handleAlignment(undefined)}
						>
							{t('auto')}
						</Button>
					</Box>
					<ButtonGroup variant='contained'>
						<Button
							minWidth='80px'
							size='small'
							onClick={() => handleAlignment('left')}
							color={
								presentation.slides[currentSlide].media[activeMedia!].settings
									?.alignment === 'left'
									? 'secondary'
									: 'primary'
							}
						>
							{t('left')}
						</Button>
						<Button
							minWidth='80px'
							size='small'
							color={
								presentation.slides[currentSlide].media[activeMedia!].settings
									?.alignment === 'center'
									? 'secondary'
									: 'primary'
							}
							onClick={() => handleAlignment('center')}
						>
							{t('center')}
						</Button>
						<Button
							minWidth='80px'
							size='small'
							onClick={() => handleAlignment('right')}
							color={
								presentation.slides[currentSlide].media[activeMedia!].settings
									?.alignment === 'right'
									? 'secondary'
									: 'primary'
							}
						>
							{t('right')}
						</Button>
					</ButtonGroup>
				</Box>
			</Popover>
		</>
	);
};

export default AlignMediaButton;
