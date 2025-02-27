
import { FormLabel } from 'react-bootstrap';
import { InfoButton } from '@components';

import './label.scss';

const Label = ({
	children,
	required = false,
	style = {},
	helpText = null,
	helpColor = undefined,
	helpStyle = {},
	helpPlacement = undefined,
}) => (
	<FormLabel style={{ ...style, marginBottom: '2px' }}>
		{children}
		{required && <span className="required"></span>}
		{helpText
			&& (
				<InfoButton
					textStyle={helpStyle}
					style={{ marginLeft: '5px' }}
					color={helpColor}
					placement={helpPlacement}
					helpText={helpText}
				/>
			)}
	</FormLabel>
);

export default Label;
