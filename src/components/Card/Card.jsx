import classNames from "classnames";
import * as BS from "react-bootstrap";

import './card.scss';

const Card = ({ className, cardBodyClassName, title, header, body, footer }) => (
    <BS.Card className={classNames('mb-3 p-3 shadow', className)}>
        <h1 className="text-center">{title}</h1>
        {header && header}
        <hr />
        <BS.CardBody className={classNames(cardBodyClassName)}>
            {body}
        </BS.CardBody>
        {footer && (
            <>
                <hr />
                {footer}
            </>
        )}
    </BS.Card>
);

export default Card;