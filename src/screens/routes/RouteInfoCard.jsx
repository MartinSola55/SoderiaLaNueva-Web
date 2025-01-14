import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Col, Row } from 'react-bootstrap';
import './route.scss'

const RouteInfoCard = ({ icon, description, bgColor, title = '' }) => {
    return (
        <Row className='m-0'>
            <Col
                xs={3}
                className='d-flex justify-content-center align-items-center route-info-card-icon'
                style={{
                    backgroundColor: bgColor,
                    borderRadius: '50%',
                    padding: '15px',
                    width: '55px',
                    height: '55px',
                }}
            >
                <FontAwesomeIcon style={{ fontSize: '25px' }} color='white' icon={icon} />
            </Col>
            <Col xs={9} className='ms-2'>
                <h4 className='mb-1'>{title}</h4>
                <p className='mb-1'>{description}</p>
            </Col>
        </Row>
    );
};

export default RouteInfoCard;
