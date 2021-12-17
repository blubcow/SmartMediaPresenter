import React from 'react';
import {
	MediaRGBChannels,
	RGBChannel,
} from '../../../shared/types/presentation';

interface IColorChannelFilterProps {
	id: number;
	channels: MediaRGBChannels;
}

const ColorChannelFilter: React.FC<IColorChannelFilterProps> = (props) => {
	const { id, channels } = props;
	const { red, green, blue } = channels;

	return (
		<svg version='1.1' xmlns='http://www.w3.org/2000/svg'>
			<defs>
				<filter id={`${id}`}>
					<feColorMatrix
						in='SourceGraphic'
						type='matrix'
						values={`
            ${red.r} ${red.g} ${red.b} ${red.alpha} 0
            ${green.r} ${green.g} ${green.b} ${green.alpha} 0
            ${blue.r} ${blue.g} ${blue.b} ${blue.alpha} 0
            0 0 0 1 0`}
					/>
				</filter>
			</defs>
		</svg>
	);
};

export default ColorChannelFilter;
