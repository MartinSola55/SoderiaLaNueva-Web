import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Col, Row } from 'react-bootstrap';
import '../route.scss'

const RouteInfoCard = ({ icon, description, bgColor, title = '' }) => {
    return (
        <Row className='m-0'>
            <Col xs={3} className='d-flex justify-content-center align-items-center p-0'>
                <span
                    className='d-flex justify-content-center align-items-center'
                    style={{
                        backgroundColor: bgColor,
                        borderRadius: '50%',
                        width: '55px',
                        height: '55px',
                        flexShrink: 0,
                    }}>
                    <FontAwesomeIcon style={{ fontSize: '25px' }} color='white' icon={icon} />
                </span>
            </Col>
            <Col className='p-0' xs={9}>
                <h4 className='ms-3 mb-1'>{title}</h4>
                <p className='ms-3 mb-1'>{description}</p>
            </Col>
        </Row>
    );
};

export default RouteInfoCard;
