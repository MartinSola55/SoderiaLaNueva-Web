import * as BS from 'react-bootstrap';
import RawHtml from '../RawHtml/RawHtml';

import './tooltip.scss';

const Tooltip = ({
    textStyle = {},
    text = '',
    placement = 'bottom',
    children
}) => {
    const tooltipContent = (
        <BS.Tooltip>
            <RawHtml style={{ ...textStyle, margin: '5px' }} html={text} />
        </BS.Tooltip>
    );

    return (
        <BS.OverlayTrigger
            trigger={['hover', 'focus', 'touch']}
            placement={placement}
            overlay={tooltipContent}
        >
            {children}
        </BS.OverlayTrigger>
    );
};

export default Tooltip;
