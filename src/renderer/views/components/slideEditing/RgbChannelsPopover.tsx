import React, { useState } from 'react';
import { MediaRGBChannels } from '../../../shared/types/presentation';
import { Popover, Box, Text, Button, Slider } from '../../../smpUI/components';
import { RestartAlt } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';

type RgbChannel = 'red' | 'green' | 'blue';
type RgbSubChannel = 'r' | 'g' | 'b' | 'alpha';

interface IRbgCahnnelsPopOverProps {
	anchorEl?: Element;
	onClose: () => void;
	onChannelsChanged: (
		mainChannel: RgbChannel,
		subChannel: RgbSubChannel,
		val: number
	) => void;
	channels: MediaRGBChannels;
	reset: () => void;
}

const RgbChannelsPopover: React.FC<IRbgCahnnelsPopOverProps> = (props) => {
	const { anchorEl, onClose, onChannelsChanged, channels, reset } = props;
	const [currentChannel, setCurrentChannel] = useState<RgbChannel>('red');
	const { t } = useTranslation([i18nNamespace.Presentation]);

	const handleChange = (
		mainChannel: RgbChannel,
		subChannel: RgbSubChannel,
		val: number
	) => {
		onChannelsChanged(mainChannel, subChannel, val);
	};

	return (
		<Popover
			elevation={10}
			PaperProps={{ sx: { backgroundColor: 'background.default' } }}
			anchorEl={anchorEl}
			open={anchorEl !== undefined}
			anchorOrigin={{
				vertical: 'top',
				horizontal: 'center',
			}}
			transformOrigin={{
				vertical: 'bottom',
				horizontal: 'center',
			}}
			onClose={onClose}
		>
			<Box
				sx={{
					padding: 2,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					width: '450px',
				}}
			>
				<Button variant='contained' color='secondary' onClick={reset}>
					<RestartAlt sx={{ pr: 0.5 }} />
					{t('reset')}
				</Button>
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'space-evenly',
						width: '50%',
						pt: 4,
						pb: 2,
					}}
				>
					<ChannelSelector
						channel='red'
						selected={currentChannel === 'red'}
						onSelect={(channel) => setCurrentChannel(channel)}
					/>
					<ChannelSelector
						channel='green'
						selected={currentChannel === 'green'}
						onSelect={(channel) => setCurrentChannel(channel)}
					/>
					<ChannelSelector
						channel='blue'
						selected={currentChannel === 'blue'}
						onSelect={(channel) => setCurrentChannel(channel)}
					/>
				</Box>
				<Box sx={{ width: '100%' }}>
					<ChannelSlider
						channel='r'
						value={channels[currentChannel].r}
						min={0}
						max={100}
						onChange={(channel, val) =>
							handleChange(currentChannel, channel, val)
						}
					/>
					<ChannelSlider
						channel='g'
						value={channels[currentChannel].g}
						min={0}
						max={100}
						onChange={(channel, val) =>
							handleChange(currentChannel, channel, val)
						}
					/>
					<ChannelSlider
						channel='b'
						value={channels[currentChannel].b}
						min={0}
						max={100}
						onChange={(channel, val) =>
							handleChange(currentChannel, channel, val)
						}
					/>
					<ChannelSlider
						channel='alpha'
						value={channels[currentChannel].alpha}
						min={-20}
						max={20}
						onChange={(channel, val) =>
							handleChange(currentChannel, channel, val)
						}
					/>
				</Box>
				<Button sx={{ mt: 2 }} variant='contained' onClick={onClose}>
					{t('finish')}
				</Button>
			</Box>
		</Popover>
	);
};

interface IChannelSelectorProps {
	channel: RgbChannel;
	selected: boolean;
	onSelect: (channel: RgbChannel) => void;
}

const ChannelSelector: React.FC<IChannelSelectorProps> = (props) => {
	const { channel, selected, onSelect } = props;
	return (
		<Box
			sx={{
				height: '20px',
				width: '20px',
				borderColor: selected ? 'primary.main' : 'text.primary',
				borderWidth: '2px',
				borderStyle: 'solid',
				borderRadius: '10px',
				bgcolor: channel,
				cursor: 'pointer',
			}}
			onClick={() => onSelect(channel)}
		/>
	);
};

interface IChannelSliderProps {
	channel: RgbSubChannel;
	min: number;
	max: number;
	value: number;
	onChange: (channel: RgbSubChannel, val: number) => void;
}

const ChannelSlider: React.FC<IChannelSliderProps> = (props) => {
	const { channel, min, max, value, onChange } = props;
	return (
		<Box sx={{ display: 'flex', width: '100%' }}>
			<Box sx={{ pr: 2 }}>
				<Text>{channel}:</Text>
			</Box>
			<Slider
				min={min}
				max={max}
				value={value * 10}
				size='small'
				valueLabelDisplay='auto'
				onChange={(_, val) => {
					const newVal = Array.isArray(val) ? val[0] : val;
					onChange(channel, newVal / 10);
				}}
			/>
		</Box>
	);
};

export default RgbChannelsPopover;
