import { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router';
import { getBreadcrumbItems, getProductTypes, getSubscription, saveSubscription } from './Subscriptions.helpers';
import App from '../../app/App';

const CreateSubscription = ({ isWatching = false }) => {
	const navigate = useNavigate();

	const columns = [
		{
			name: 'description',
			text: 'Producto',
			textCenter: true,
		},
		{
			name: 'quantity',
			text: 'Cantidad',
			className: 'text-center',
			component: (props) => <CellNumericInput {...props} value={props.row.quantity} disabled={isWatching} maxValue={undefined} onChange={(v) => handleProductsChange(props, v)} />
		},
	];

    const params = useParams();
    const id = params.id;

    // State
    const [form, setForm] = useState(InitialFormStates.Subscription);
    const [submiting, setSubmiting] = useState(false);
    const [loading, setLoading] = useState(true);

    // Effects
    useEffect(() => {
        if (id) {
			getSubscription(
				id,
				// onSuccess
				(data) => {
					setForm(data);
					setLoading(false);
				},
				// onError
				() => { navigate('/notFound') }
			);
        } else {
            getProductTypes((products) => {
                setForm((prevForm) => ({
                    ...prevForm,
                    subscriptionProducts: products,
                }));
                setLoading(false);
            });
        }
    }, [id, navigate, isWatching]);

	// Handlers
	const handleSubmit = async () => {
		if (submitting) return;

        if (!form.name || !form.price) {
            Toast.warning(Messages.Validation.requiredFields);
            return;
        }
        if (productRows.every((x) => !x.quantity)) {
            Toast.warning('El abono debe contar minimamente con un producto.');
            return;
        }

        setSubmiting(true);
        saveSubscription(form, id, productRows,
            () => { navigate('/abonos/list') },
            () => { setSubmiting(false) }
        );
    };

	const handleInputChange = (value, field) => {
		setForm((prevForm) => {
			return {
				...prevForm,
				[field]: value,
			};
		});
	};

    const handleProductsChange = (props, value) => {
        const products = productRows.map((x) => {
            if (x.id === props.row.id)
                return {
                    ...x,
                    quantity: value,
                };
            return x;
        });

		handleInputChange(products, 'subscriptionProducts');
	};

	// Render
	if (!App.isAdmin()) {
		return navigate('/notAllowed');
	}

    return (
        <>
            <BreadCrumb items={getBreadcrumbItems(id ? 'Editar' : 'Nuevo')} title='Abonos' />
            <Col xs={12} className='container'>
                <Row>
                    <Col xs={6}>
                        <Card
                            title='Datos'
                            body={loading ? <Spinner /> :
                                <Row className='align-items-center'>
                                    <Col xs={12} md={6} className='pe-3 mb-3'>
                                        <Label required={!isWatching}>Nombre del abono</Label>
                                        <Input
                                            helpText={!isWatching && 'Ej: Abono X4'}
                                            disabled={isWatching}
                                            value={form.name}
                                            onChange={(value) => handleInputChange(value, 'name')}
                                        />
                                    </Col>
                                    <Col xs={12} md={6} className='pe-3 mb-3'>
                                        <Label required={!isWatching}>Precio</Label>
                                        <Input
                                            helpText={!isWatching && '\u00A0'}
                                            disabled={isWatching}
                                            isFloat
                                            minValue={0}
                                            placeholder='$'
                                            type='number'
                                            value={form.price}
                                            onChange={(value) => handleInputChange(value, 'price')}
                                        />
                                    </Col>
                                </Row>
                            }
                            footer={
                                <div className='d-flex justify-content-end'>
                                    <Button
                                        variant='secondary'
                                        className='me-2'
                                        onClick={() => navigate('/abonos/list')}
                                    >
                                        Volver
                                    </Button>
                                    {!isWatching && (
                                        <Button onClick={handleSubmit} disabled={submiting}>
                                            {submiting ? <Loader /> : id ? 'Actualizar' : 'Crear'}
                                        </Button>
                                    )}
                                </div>
                            }
                        />
                    </Col>
                    <Col xs={6}>
                        <Card
                            title='Productos del abono'
                            body={loading ? <Spinner /> :
                                <Row className='align-items-center'>
                                    <Col xs={12}>
										<Table rows={isWatching ? form.subscriptionProducts : productRows} columns={columns} />
                                    </Col>
                                </Row>
                            }
                        />
                    </Col>
                </Row>
            </Col>
        </>
    );
};

export default CreateSubscription;
