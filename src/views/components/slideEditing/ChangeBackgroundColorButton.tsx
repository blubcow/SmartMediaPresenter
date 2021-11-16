import React from 'react';
import { Box } from '../../../smpUI/components';
import EditingButton, { IEditingButtonProps } from './EditingButton';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';
import EditButtonLabel from './EditButtonLabel';

interface IChangeBackgroundColorButtonProps
	extends Omit<IEditingButtonProps, 'icon' | 'secondaryNode'> {
	backgroundColor: string;
}

const ChangeBackgroundColorButton: React.FC<IChangeBackgroundColorButtonProps> =
	(props) => {
		const { backgroundColor } = props;
		const { t } = useTranslation([i18nNamespace.Presentation]);
		return (
			<EditingButton
				icon={<BackgroundColorIcon color={backgroundColor} />}
				secondaryNode={
					<EditButtonLabel>{t('changeSlideColor')}</EditButtonLabel>
				}
				{...props}
			/>
		);
	};

interface IBackgroundColorIconProps {
	color: string;
}

const BackgroundColorIcon: React.FC<IBackgroundColorIconProps> = (props) => {
	const { color } = props;

	return (
		<Box
			sx={{
				height: '100%',
				width: '100%',
				bgcolor: color,
				borderWidth: '2px',
				borderStyle: 'solid',
				borderColor: 'text.primary',
				borderRadius: 1,
			}}
		/>
	);
};

export default ChangeBackgroundColorButton;
