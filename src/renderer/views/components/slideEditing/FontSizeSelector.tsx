import React, { useState, useEffect } from 'react';
import usePresentationEditingContext from '../../../hooks/usePresentationEditingContext';
import { TextElement } from '../../../shared/types/presentation';
import { Popover, Box, Button, Text } from '../../../smpUI/components';
import EditButtonLabel from './EditButtonLabel';
import EditingButton from './EditingButton';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';
import { PresentationEditingActionIdentifiers } from '../../../types/identifiers';

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
					<Text>{`${Math.round(
						(editingBoxDimensions.width / textSize.rel) * textSize.font
					)}px`}</Text>
				}
				secondaryNode={<EditButtonLabel>{t('fontSize')}</EditButtonLabel>}
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
					<Text>{t('chooseFontSize')}</Text>
					<Box
						sx={{
							paddingTop: 2,
							paddingBottom: 2,
							width: '130px',
							textAlign: 'center',
						}}
					>
						<Text
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
						</Text>
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
