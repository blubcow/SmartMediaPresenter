import {
	AlignHorizontalCenter,
	AlignHorizontalLeft,
	AlignHorizontalRight,
} from '@mui/icons-material';
import { Box, Button, ButtonGroup, Card } from '@mui/material';
import React from 'react';
import { usePresentationEditingContext } from '../../hooks';
import { PresentationEditingActionIdentifiers } from '../../shared/identifiers.enum';
import { TextAlignment, TextElement } from '../../shared/presentation.interface';

const TextAliginmentButton: React.FC<{}> = () => {
	const { state, dispatch } = usePresentationEditingContext();
	const { presentation, currentSlide, activeComponent = 0 } = state;
	const textElement = presentation.slides[currentSlide].elements![
		activeComponent
	] as TextElement;

	const handleClick = (alignment: TextAlignment) => {
		const newPresentation = JSON.parse(JSON.stringify(presentation));
		newPresentation.slides[currentSlide].elements[activeComponent].alignment =
			alignment;
		dispatch({
			type: PresentationEditingActionIdentifiers.presentationSettingsUpdated,
			payload: { presentation: newPresentation },
		});
	};

	return (
		<Box sx={{ display: 'flex', alignItems: 'center' }}>
			<Card elevation={10}>
				<ButtonGroup variant='contained' color='info'>
					<Button
						onClick={() => {
							handleClick('left');
						}}
						sx={{
							minWidth: '60px',
							bgcolor:
								textElement.alignment === 'left' ? 'primary.main' : undefined,
						}}
					>
						<AlignHorizontalLeft />
					</Button>
					<Button
						onClick={() => {
							handleClick('center');
						}}
						sx={{
							minWidth: '60px',
							bgcolor:
								textElement.alignment === 'center' ? 'primary.main' : undefined,
						}}
					>
						<AlignHorizontalCenter />
					</Button>
					<Button
						onClick={() => {
							handleClick('right');
						}}
						sx={{
							minWidth: '60px',
							bgcolor:
								textElement.alignment === 'right' ? 'primary.main' : undefined,
						}}
					>
						<AlignHorizontalRight />
					</Button>
				</ButtonGroup>
			</Card>
		</Box>
	);
};

export default TextAliginmentButton;
