import { Box, Button, Popover } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePresentationEditingContext } from '../../hooks';
import { i18nNamespace } from '../../i18n/i18n';
import { PresentationEditingActionIdentifiers } from '../../shared/identifiers.enum';
import { TextElement } from '../../shared/presentation.interface';
import { EditableText } from '../../smpUI';
import { EditableCaptionText } from './EditableCaptionText';
import EditingButton from './EditingButton';

interface IFontSizeSelectorProps {}

const FontSizeSelector: React.FC<IFontSizeSelectorProps> = () => {
	const { state, dispatch } = usePresentationEditingContext();
	const { presentation, currentSlide, activeComponent, editingBoxDimensions } =
		state;
	const textSize = (
		presentation.slides[currentSlide].elements![activeComponent!] as TextElement
	).size;
	const [newSize, setNewSize] = useState<string>();
	const { t } = useTranslation([i18nNamespace.Presentation]);
	const [anchorElement, setAnchorElement] = useState<
		HTMLDivElement | undefined
	>(undefined);

	useEffect(() => {
		if (anchorElement !== undefined) setNewSize(undefined);
	}, [anchorElement]);

	return (
		<>
			<EditingButton
				selected={anchorElement !== undefined}
				icon={
					<EditableText>{`${Math.round(
						(editingBoxDimensions.width / textSize.rel) * textSize.font
					)}px`}</EditableText>
				}
				secondaryNode={<EditableCaptionText>{t('fontSize')}</EditableCaptionText>}
				onClick={(e) => setAnchorElement(e.currentTarget)}
			/>
			<Popover
				open={anchorElement !== undefined}
				anchorEl={anchorElement}
				onClose={() => setAnchorElement(undefined)}
			>
				<Box
					sx={{
						padding: 2,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'space-between',
					}}
				>
					<EditableText>{t('chooseFontSize')}</EditableText>
					<Box
						sx={{
							paddingTop: 2,
							paddingBottom: 2,
							width: '130px',
							textAlign: 'center',
						}}
					>
						<EditableText
							editable
							placeholder={t('newFontSize')}
							color={newSize !== undefined ? 'text.primary' : 'GrayText'}
							variant={newSize !== undefined ? 'h4' : 'body1'}
							parseInput={(val) =>
								`${
									val === ''
										? ''
										: isNaN(parseFloat(val))
										? 0
										: Math.max(parseFloat(val), 0)
								}`
							}
							editableTextDidChange={(_, curr) => {
								setNewSize(curr === '' ? undefined : curr);
							}}
						>
							{newSize}
						</EditableText>
					</Box>
					<Button
						variant='contained'
						onClick={() => {
							if (newSize === undefined || newSize === '') {
								setAnchorElement(undefined);
							} else {
								const newPresentation = JSON.parse(
									JSON.stringify(presentation)
								);
								newPresentation.slides[currentSlide].elements[
									activeComponent!
								].size = {
									rel: editingBoxDimensions.width,
									font: parseFloat(newSize),
								};
								dispatch({
									type: PresentationEditingActionIdentifiers.presentationSettingsUpdated,
									payload: { presentation: newPresentation },
								});
								setAnchorElement(undefined);
							}
						}}
					>
						{t('confirm')}
					</Button>
				</Box>
			</Popover>
		</>
	);
};

export default FontSizeSelector;
