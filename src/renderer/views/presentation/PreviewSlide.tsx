import React, { useState, useEffect } from 'react';
import {
	SinglePresentation,
	Slide,
	SlideTheme,
} from '../../shared/presentation.interface';
import SlideBox from '../slide/SlideEditingBox';

interface IPreviewProps {
	slide: Slide;
	theme: SlideTheme;
	isCaching: boolean;
	failedToLoad?: number;
}

const PreviewSlide: React.FC<IPreviewProps> = (props) => {
	const { slide, theme, isCaching, failedToLoad } = props;

	return (
		<SlideBox
			slide={slide}
			theme={theme}
			presentationFrameEditingEnabled={false}
			showCachingBadge={isCaching}
			failedToLoad={failedToLoad}
		/>
	);
};

export default PreviewSlide;