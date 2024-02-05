import React from 'react';
import { ButtonGroup } from '@mui/material';
import { Box, Card, Button } from '../../../smpUI/components';
import { FormatItalic, FormatBold } from '@mui/icons-material';
import usePresentationEditingContext from '../../../hooks/usePresentationEditingContext';
import { TextElement } from '../../../shared/types/presentation';
import { PresentationEditingActionIdentifiers } from '../../../types/identifiers';

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
						minWidth={'60px'}
						sx={{
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
						minWidth={'60px'}
						sx={{
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
