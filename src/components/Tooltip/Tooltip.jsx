import * as BS from 'react-bootstrap';
import RawHtml from '../RawHtml/RawHtml';

import './tooltip.scss';

const Tooltip = ({
	textStyle = {},
	text = '',
	placement = 'bottom',
	tooltipContent,
	children
}) => {
	const tooltip = (
		<BS.Tooltip>
			{tooltipContent || (
				<RawHtml style={{ ...textStyle, margin: '5px' }} html={text} />
			)}
		</BS.Tooltip>
	);

	return (
		<BS.OverlayTrigger
			trigger={['hover', 'focus', 'touch']}
			placement={placement}
			overlay={tooltip}
		>
			{children}
		</BS.OverlayTrigger>
	);
};

export default Tooltip;
