import React from 'react';
import IconFrame from './IconFrame';
import { Box } from '../../../smpUI/components';
import { useAudioIconStyles } from './styles';

interface IAudioIconProps {
	isPlaying: boolean;
}

const AudioIcon: React.FC<IAudioIconProps> = (props) => {
	const { isPlaying } = props;
	const classes = useAudioIconStyles();

	return (
		<IconFrame
			icon={
				<Box className={classes.container}>
					<Box className={isPlaying ? classes.bar3Animated : classes.bar3} />
					<Box className={classes.spacer} />
					<Box className={isPlaying ? classes.bar4Animated : classes.bar2} />
					<Box className={classes.spacer} />
					<Box className={isPlaying ? classes.bar1Animated : classes.bar1} />
					<Box className={classes.spacer} />
					<Box className={isPlaying ? classes.bar2Animated : classes.bar2} />
					<Box className={classes.spacer} />
					<Box className={isPlaying ? classes.bar3Animated : classes.bar3} />
				</Box>
			}
		/>
	);
};

export default AudioIcon;
