import React from 'react';
import { ButtonGroup, Card } from '@mui/material';
import { Button } from '../../smpUI';
import { Box} from '@mui/material';
import {
	AlignHorizontalCenter,
	AlignHorizontalLeft,
	AlignHorizontalRight,
} from '@mui/icons-material';
import usePresentationEditingContext from '../../hooks/usePresentationEditingContext';
import { TextAlignment, TextElement } from '../../shared/presentation.interface';
import { PresentationEditingActionIdentifiers } from '../../shared/identifiers.enum';

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
						minWidth={'60px'}
						sx={{
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
						minWidth={'60px'}
						sx={{
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
						minWidth={'60px'}
						sx={{
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
