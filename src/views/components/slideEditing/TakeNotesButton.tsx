import React, { useState, useEffect } from 'react';
import EditingButton, { IEditingButtonProps } from './EditingButton';
import { Box, Button, Drawer, Text, TextArea } from '../../../smpUI/components';
import { Notes } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';
import EditButtonLabel from './EditButtonLabel';
import { SlideSettings } from '../../../shared/types/presentation';

interface ITakeNotesButtonProps
	extends Omit<IEditingButtonProps, 'icon' | 'secondaryNode'> {
	initialNotes?: string;
	onSlideSettingsChanged: (settings: Partial<SlideSettings>) => void;
}

const TakeNotesButton: React.FC<ITakeNotesButtonProps> = (props) => {
	const { initialNotes, onSlideSettingsChanged } = props;
	const [openDrawer, setOpenDrawer] = useState<boolean>(false);
	const { t } = useTranslation([i18nNamespace.Presentation]);
	const [notes, setNotes] = useState<string | undefined>(initialNotes);

	useEffect(() => {
		setNotes(initialNotes);
	}, [initialNotes]);

	return (
		<React.Fragment>
			<EditingButton
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
						<Text variant='h5'>{t('notes')}</Text>
						<Box>
							<Button
								variant='contained'
								color='secondary'
								onClick={() => {
									setNotes(initialNotes);
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
									onSlideSettingsChanged({ notes: notes });
									setOpenDrawer(false);
								}}
							>
								{t('confrim')}
							</Button>
						</Box>
					</Box>
					<Box sx={{ flex: 1, width: '100%', padding: 2 }}>
						<TextArea
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
