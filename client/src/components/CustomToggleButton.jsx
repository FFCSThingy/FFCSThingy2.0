import React from 'react';
import { ToggleButton } from 'react-bootstrap';

import '../css/CustomToggleButton.scss';

const CustomToggleButton = ({ value, size }) => (
	<ToggleButton
		className="toggleCustom"
		value={value}
		size={size}
	>
		{value}
	</ToggleButton>
);

export default CustomToggleButton;
