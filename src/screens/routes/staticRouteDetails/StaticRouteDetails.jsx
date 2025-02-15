import { useEffect, useRef, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router';
import { BreadCrumb, Button, Card, Spinner } from '../../../components';
import API from '../../../app/API';
import App from '../../../app/App';
import { InitialFormStates } from '../../../app/InitialFormStates';
import { formatDeliveryDay, openActionConfirmationModal } from '../../../app/Helpers';
import LastProductsModal from '../lastProducts/LastProductsModal';
import ActionConfirmationModal from '../../../components/shared/ActionConfirmationModal/ActionConfirmationModal';
import { CartDetailCard } from '../cards/CartDetailCard';
import '../route.scss';

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
        API.get('route/getStaticRoute', { id })
            .then((r) => {
                setForm(() => ({
                    ...r.data,
                }));
                setLoading(false);
            })
            .catch(() => {
                navigate('/notFound');
            });
    }, [id, navigate]);

    //  Handlers
    const handleSubscriptionRenewals = () => {
        openActionConfirmationModal(actionConfirmationRef, { routeId: id }, 'subscription/renewByRoute', 'Esta acción no se puede revertir', '¿Seguro deseas renovar TODOS los abonos? Esto sólo incluye los clientes de esta planilla. Si un abono ya se renovó, no se volverá a renovar', () => { });
    };

    const hanldeOpenNewRoute = () => {
        openActionConfirmationModal(actionConfirmationRef, { routeId: id }, 'route/openNew', '¿Seguro deseas comenzar el reparto?', null, (r) => navigate(`/planillas/abierta/${r.data.id}`));
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
                                    <h6>No existen repartos para esta ruta</h6>
                                )}
                                {form.carts.map((cart, idx) => {
                                    return (
                                        <CartDetailCard
                                            key={idx}
                                            idx={idx}
                                            cart={cart}
                                            lastProductsRef={lastProductsRef} />
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
