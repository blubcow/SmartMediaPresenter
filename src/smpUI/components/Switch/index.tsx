import React from 'react';
import { Switch as MuiSwitch, SwitchProps } from '@mui/material';

interface ISwitchProps extends SwitchProps {}

const Switch: React.FC<ISwitchProps> = (props) => {
	return <MuiSwitch {...props} />;
};

export default Switch;
