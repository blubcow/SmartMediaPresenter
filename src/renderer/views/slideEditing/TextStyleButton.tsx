import { FormatBold, FormatItalic } from '@mui/icons-material';
import { Box, Button, ButtonGroup, Card } from '@mui/material';
import React, { FC } from 'react';
import { usePresentationEditingContext } from '../../hooks';
import { PresentationEditingActionIdentifiers } from '../../shared/identifiers.enum';
import { TextElement } from '../../shared/presentation.interface';

const TextStyleButton: React.FC<{}> = () => {
	const { state, dispatch } = usePresentationEditingContext();
	const { presentation, currentSlide, activeComponent = 0 } = state;
	const textElement = presentation.slides[currentSlide].elements![
		activeComponent
	] as TextElement;

	return (
		<Box sx={{ display: 'flex', alignItems: 'center' }}>
			<Card elevation={10}>
				<ButtonGroup variant='contained' color='info'>
					<Button
						sx={{
							minWidth: '60px',
							bgcolor: textElement.italic ? 'primary.main' : undefined,
						}}
						onClick={() => {
							const newPresentation = JSON.parse(JSON.stringify(presentation));
							newPresentation.slides[currentSlide].elements[
								activeComponent
							].italic = !textElement.italic;
							dispatch({
								type: PresentationEditingActionIdentifiers.presentationSettingsUpdated,
								payload: { presentation: newPresentation },
							});
						}}
					>
						<FormatItalic />
					</Button>
					<Button
						sx={{
							minWidth: '60px',
							bgcolor: textElement.bold ? 'primary.main' : undefined,
						}}
						onClick={() => {
							const newPresentation = JSON.parse(JSON.stringify(presentation));
							newPresentation.slides[currentSlide].elements[
								activeComponent
							].bold = !textElement.bold;
							dispatch({
								type: PresentationEditingActionIdentifiers.presentationSettingsUpdated,
								payload: { presentation: newPresentation },
							});
						}}
					>
						<FormatBold />
					</Button>
				</ButtonGroup>
			</Card>
		</Box>
	);
};

export default TextStyleButton;
