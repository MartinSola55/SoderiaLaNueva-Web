import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import RawHtml from '../RawHtml/RawHtml';

import './infoButton.scss';

const InfoButton = ({
    style,
    size = 'sm',
    textStyle,
    color = 'steelblue',
    placement = 'bottom',
    helpText = null,
}) => {
    const tooltipContent = (
        <Tooltip>
            <RawHtml style={{ ...textStyle, margin: '5px' }} html={helpText} />
        </Tooltip>
    );

    return (
        <OverlayTrigger
            trigger={['hover', 'focus']}
            placement={placement}
            overlay={tooltipContent}
        >
            <FontAwesomeIcon
                size={size}
                icon={faInfoCircle}
                style={{ ...style, color }}
            />
        </OverlayTrigger>
    );
};

export default InfoButton;
