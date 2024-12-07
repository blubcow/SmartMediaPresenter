import { Notes } from '@mui/icons-material';
import { Box, Button, Drawer, TextareaAutosize } from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePresentationEditingContext } from '../../hooks';
import { i18nNamespace } from '../../i18n/i18n';
import { PresentationEditingActionIdentifiers } from '../../shared/identifiers.enum';
import { EditableText } from '../../smpUI/EditableText';
import EditButtonLabel from './EditButtonLabel';
import EditingButton from './EditingButton';

interface ITakeNotesButtonProps {}

const TakeNotesButton: React.FC<ITakeNotesButtonProps> = (props) => {
	const { state, dispatch } = usePresentationEditingContext();
	const { presentation, currentSlide } = state;
	const [openDrawer, setOpenDrawer] = useState<boolean>(false);
	const { t } = useTranslation([i18nNamespace.Presentation]);
	const [notes, setNotes] = useState<string | undefined>(
		presentation.slides[currentSlide].settings?.notes
	);

	return (
		<React.Fragment>
			<EditingButton
				selected={openDrawer}
				icon={
					<Notes
						sx={{ color: 'text.primary', height: '100%', width: '100%' }}
					/>
				}
				secondaryNode={<EditButtonLabel>{t('addNotes')}</EditButtonLabel>}
				{...props}
				onClick={() => setOpenDrawer(true)}
			/>
			<Drawer
				open={openDrawer}
				anchor='bottom'
				onClose={() => setOpenDrawer(false)}
			>
				<Box
					sx={{
						height: '350px',
						width: '100%',
						padding: 2,
						display: 'flex',
						flexDirection: 'column',
					}}
				>
					<Box
						sx={{
							width: '100%',
							display: 'flex',
							justifyContent: 'space-between',
						}}
					>
						<EditableText variant='h5'>{t('notes')}</EditableText>
						<Box>
							<Button
								variant='contained'
								color='secondary'
								onClick={() => {
									setNotes(presentation.slides[currentSlide].settings?.notes);
									setOpenDrawer(false);
								}}
							>
								{t('cancel')}
							</Button>

							<Button
								sx={{ ml: 2 }}
								variant='contained'
								color='primary'
								onClick={() => {
									let newPresentation = { ...presentation };
									newPresentation.slides = [...presentation.slides];
									newPresentation.slides[currentSlide] = {
										...presentation.slides[currentSlide],
										settings: {
											...newPresentation.slides[currentSlide].settings,
											notes: notes,
										},
									};

									dispatch({
										type: PresentationEditingActionIdentifiers.presentationSettingsUpdated,
										payload: { presentation: newPresentation },
									});
									setOpenDrawer(false);
								}}
							>
								{t('confirm')}
							</Button>
						</Box>
					</Box>
					<Box sx={{ flex: 1, width: '100%', padding: 2 }}>
						<TextareaAutosize
							placeholder={t('typeNotesHere')}
							value={notes}
							onChange={(e) => {
								setNotes(e.target.value);
							}}
							style={{
								height: '100%',
								width: '100%',
								background: 'transparent',
								color: 'inherit',
							}}
						/>
					</Box>
				</Box>
			</Drawer>
		</React.Fragment>
	);
};

export default TakeNotesButton;
