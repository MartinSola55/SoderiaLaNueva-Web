import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Col, Row } from 'react-bootstrap';
import '../route.scss'

const RouteInfoCard = ({ icon, description, bgColor, title = '' }) => {
    return (
        <Row className='m-0'>
            <Col
                xs={3}
				md={5}
				lg={4}
				xl={6}
                className='d-flex justify-content-center align-items-center route-info-card-icon flex-1'
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
            <Col xs={9} md={7} lg={8} xl={6} className='ms-3 p-0'>
                <h4 className='mb-1'>{title}</h4>
                <p className='mb-1'>{description}</p>
            </Col>
        </Row>
    );
};

export default RouteInfoCard;
