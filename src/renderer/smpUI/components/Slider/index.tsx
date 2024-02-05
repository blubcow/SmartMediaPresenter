import React from 'react';
import { Slider as MuiSlider, SliderProps } from '@mui/material';

interface ISliderPorps extends SliderProps {}

const Slider: React.FC<ISliderPorps> = (props) => {
	return <MuiSlider {...props} />;
};

export default Slider;
