import { Col, Row } from 'react-bootstrap';
import { BreadCrumb, Button, Card, Spinner } from '../../../components';
import { useEffect, useRef, useState } from 'react';
import API from '../../../app/API';
import { useNavigate, useParams } from 'react-router';
import App from '../../../app/App';
import { InitialFormStates } from '../../../app/InitialFormStates';
import { formatDebt, formatDeliveryDay, getDebtTextColor } from '../../../app/Helpers';
import { faHouse, faPhone, faTruck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LastProductsModal from '../lastProducts/LastProductsModal';
import LastProductsButton from '../lastProducts/LastProductsButton';
import '../route.scss';
import ActionConfirmationModal from '../../../components/shared/ActionConfirmationModal/ActionConfirmationModal';

const breadcrumbItems = [
    {
        active: false,
        url: '/planillas/list',
        label: 'Planillas',
    },
    {
        active: true,
        label: 'Detalles',
    },
];
const initialForm = InitialFormStates.RouteDetails;

const StaticRouteDetails = () => {
    // Consts
    const navigate = useNavigate();
    const params = useParams();
    const id = (params && params.id) || null;

    // States
    const [form, setForm] = useState(initialForm);
    const [loading, setLoading] = useState(true);

    // Refs
    const lastProductsRef = useRef(null);
    const actionConfirmationRef = useRef(null);

    // Effects
    useEffect(() => {
        if (!App.isAdmin()) {
            return navigate('/notAllowed');
        }
    }, [navigate]);

    useEffect(() => {
        API.get('Route/GetStaticRoute', { id }).then((r) => {
            setForm(() => ({
                ...r.data,
            }));
            setLoading(false);
        });
    }, [id]);

    //  Handlers
    const handleOpenLastProducts = (lastProducts) => {
        lastProductsRef.current?.open(() => { }, lastProducts);
    };

    const handleSubscriptionRenewals = () => {
        actionConfirmationRef.current?.open(
            { routeId: id },
            'Subscription/RenewByRoute',
            'Esta acción no se puede revertir',
            '¿Seguro deseas renovar TODOS los abonos? Esto sólo incluye los clientes de esta planilla. Si un abono ya se renovó, no se volverá a renovar',
            () => { },
        );
    };
	
    const hanldeOpenNewRoute = () => {
        actionConfirmationRef.current?.open(
            { routeId: id },
            'Route/OpenNew',
            '¿Seguro deseas comenzar el reparto?',
            null,
            (r) => navigate(`/planillas/abierta/${r.data.id}`),
        );
    };

    return (
        <>
            <BreadCrumb items={breadcrumbItems} title='Planillas' />
            <LastProductsModal ref={lastProductsRef} />
            <ActionConfirmationModal ref={actionConfirmationRef} />
            <Col xs={12} className='container'>
                <Row className='m-0'>
                    <Col
                        md={5}
                        className='mb-3 bg-white p-3 d-flex shadow rounded justify-content-around offset-md-7 flex-column flex-md-row'
                    >
                        <Button
                            className='mb-2 mb-md-0 me-0 me-md-4'
                            onClick={handleSubscriptionRenewals}
                        >
                            Renovar abonos de esta planilla
                        </Button>
                        <Button onClick={hanldeOpenNewRoute}>Abrir nueva planilla</Button>
                    </Col>
                </Row>
                <Card
                    title={`Repartos de ${form.dealer} para el  ${formatDeliveryDay(form.deliveryDay)}`}
                    body={
                        loading ? (
                            <Spinner />
                        ) : (
                            <Row>
								{form.carts.length === 0 && (
									<span>No existen carritos para esta ruta</span>
								)}
                                {form.carts.map((cart, idx) => {
                                    return (
                                        <Col xs={12} key={idx} className='row mx-0'>
                                            <Col
                                                xs={10}
                                                md={5}
                                                className={`order-2 ${idx % 2 ? 'order-2' : 'order-md-1'}`}
                                            >
                                                <div className='shadow rounded p-3'>
                                                    <Row className='m-0'>
                                                        <Col xs={8} md={10}>
                                                            <h4>{`${cart.name} - Pendiente`}</h4>
                                                        </Col>
                                                        <Col
                                                            xs={4}
                                                            md={2}
                                                            className='d-flex mx-auto my-auto'
                                                        >
                                                            <LastProductsButton
                                                                onClick={() =>
                                                                    handleOpenLastProducts(
                                                                        cart.lastProducts,
                                                                    )
                                                                }
                                                            />
                                                        </Col>
                                                        <Col xs={12} className='mt-1'>
                                                            <p className='mb-1'>Bajada: #{cart.id}</p>
                                                            <p className='mb-1'>
                                                                Creado: {cart.createdAt}
                                                            </p>
															{cart.updatedAt && (
																<p className='mb-1'>
																	Últ. modif: {cart.updatedAt}
																</p>
															)}
                                                            <p className={`mb-1 ${getDebtTextColor(cart.debt)}`}>
                                                                {formatDebt(cart.debt)}
                                                            </p>
                                                            <p className='mb-1'>
                                                                <FontAwesomeIcon icon={faHouse} />{' '}
                                                                {cart.address} -{' '}
                                                                <FontAwesomeIcon icon={faPhone} />{' '}
                                                                {cart.phone}
                                                            </p>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </Col>
                                            <Col
                                                xs={2}
                                                className={`order-1 p-0 ${idx % 2 ? 'order-1 offset-md-5' : 'order-md-2 '}`}
                                            >
                                                <div className='timeline'>
                                                    <div className='timeline-line'></div>
                                                    <div className='timeline-icon'>
                                                        <FontAwesomeIcon icon={faTruck} />
                                                    </div>
                                                </div>
                                            </Col>
                                        </Col>
                                    );
                                })}
                            </Row>
                        )
                    }
                    footer={
                        <div className='d-flex justify-content-end'>
                            <Button
                                onClick={() => navigate(`/planillas/edit/${id}`)}
                                variant='primary'
                            >
                                Editar planilla
                            </Button>
                        </div>
                    }
                />
            </Col>
        </>
    );
};

export default StaticRouteDetails;
