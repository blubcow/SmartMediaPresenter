import React, { useEffect, useState } from 'react';
import EditingButton from './EditingButton';
import { GridView } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';
import EditButtonLabel from './EditButtonLabel';
import { Box, Button, Popover, Text } from '../../../smpUI/components';
import usePresentationEditingContext from '../../../hooks/usePresentationEditingContext';
import { MediaRessource } from '../../../shared/types/presentation';
import { PresentationEditingActionIdentifiers } from '../../../types/identifiers';

interface ISlideFormatButtonProps {}

const SlideFormatButton: React.FC<ISlideFormatButtonProps> = (props) => {
	const { state, dispatch } = usePresentationEditingContext();
	const { presentation, currentSlide } = state;
	const { t } = useTranslation([i18nNamespace.Presentation]);
	const [anchorElement, setAnchorElement] = useState<
		HTMLDivElement | undefined
	>(undefined);
	const [rows, setRows] = useState<number>(
		presentation.slides[currentSlide].rows
	);
	const [columns, setColumns] = useState<number>(
		presentation.slides[currentSlide].columns
	);

	useEffect(() => {
		setRows(presentation.slides[currentSlide].rows);
		setColumns(presentation.slides[currentSlide].columns);
	}, [currentSlide, presentation]);

	return (
		<>
			<EditingButton
				icon={
					<GridView
						sx={{ color: 'text.primary', height: '100%', width: '100%' }}
					/>
				}
				secondaryNode={<EditButtonLabel>{t('changeFormat')}</EditButtonLabel>}
				selected={false}
				onClick={(e) => setAnchorElement(e.currentTarget)}
				{...props}
			/>
			<Popover
				anchorEl={anchorElement}
				open={anchorElement !== undefined}
				onClose={() => setAnchorElement(undefined)}
			>
				<Box
					sx={{
						width: '250px',
						padding: 2,
						display: 'flex',
						flexDirection: 'column',
						textAlign: 'center',
					}}
				>
					<Text>{t('chooseSlideFormat')}</Text>
					<Box sx={{ pt: 2, display: 'flex' }}>
						<Box
							sx={{
								flex: 1,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								flexDirection: 'column',
							}}
						>
							<Text variant='caption' color='text.secondary'>
								{t('rows')}
							</Text>
							<Box sx={{ width: '35px' }}>
								<Text
									editable
									minLength={1}
									editableTextDidChange={(_, curr) => {
										setRows(parseInt(curr));
									}}
									parseInput={(val) =>
										`${
											val === ''
												? ''
												: Math.min(
														isNaN(parseInt(val))
															? 1
															: Math.max(parseInt(val), 1),
														5
												  )
										}`
									}
								>
									{rows}
								</Text>
							</Box>
						</Box>
						<Box
							sx={{
								flex: 1,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								flexDirection: 'column',
							}}
						>
							<Text variant='caption' color='text.secondary'>
								{t('columns')}
							</Text>
							<Box sx={{ width: '35px' }}>
								<Text
									editable
									minLength={1}
									editableTextDidChange={(_, curr) =>
										setColumns(parseInt(curr))
									}
									parseInput={(val) =>
										`${
											val === ''
												? ''
												: Math.min(
														isNaN(parseInt(val))
															? 1
															: Math.max(parseInt(val), 1),
														5
												  )
										}`
									}
								>
									{columns}
								</Text>
							</Box>
						</Box>
					</Box>
					<Box sx={{ pt: 2 }}>
						<Button
							variant='contained'
							onClick={() => {
								const newPresentation = { ...presentation };
								newPresentation.slides[currentSlide].rows = rows;
								newPresentation.slides[currentSlide].columns = columns;

								const slide = newPresentation.slides[currentSlide];
								const media: MediaRessource[] = [];
								for (let row = 0; row < rows; row++) {
									for (let col = 0; col < columns; col++) {
										const index = row * columns + col;

										if (index < slide.media.length)
											media.push(slide.media[index]);
										else media.push({ id: index, location: {} });
									}
								}
								newPresentation.slides[currentSlide].media = media;

								dispatch({
									type: PresentationEditingActionIdentifiers.presentationSettingsUpdated,
									payload: { presentation: newPresentation },
								});
								setAnchorElement(undefined);
							}}
						>
							{t('confirm')}
						</Button>
					</Box>
				</Box>
			</Popover>
		</>
	);
};

export default SlideFormatButton;
