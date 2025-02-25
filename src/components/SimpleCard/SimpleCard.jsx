import classNames from 'classnames';
import * as BS from 'react-bootstrap';

import './simpleCard.scss';

const SimpleCard = ({ className, body }) => (
	<BS.Card className={classNames('shadow', className)}>
		<BS.CardBody>{body}</BS.CardBody>
	</BS.Card>
);

export default SimpleCard;
