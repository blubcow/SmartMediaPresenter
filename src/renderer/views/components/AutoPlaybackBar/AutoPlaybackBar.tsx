import React, { useState, useEffect } from 'react';
import { Box } from '../../../smpUI/components';

interface IAutoPlaybackBarProps {
	slideTime?: number;
	slideNumber: number;
}

const AutoPlaybackBar: React.FC<IAutoPlaybackBarProps> = (props) => {
	const { slideTime, slideNumber } = props;

	const [width, setWidth] = useState<number>(0);

	useEffect(() => {
		if (slideTime === undefined) return;
		const timeout = setTimeout(() => setWidth(100), 10);
		return () => {
			setWidth(0);
			clearTimeout(timeout);
		};
	}, [slideTime, slideNumber]);

	return (
		<Box
			sx={{
				position: 'absolute',
				bottom: 0,
				left: 0,
				height: '5px',
				bgcolor: 'secondary.main',
				width: `${width}%`,
				transition: width === 100 ? `${slideTime}s linear` : undefined,
			}}
		/>
	);
};

export default AutoPlaybackBar;
