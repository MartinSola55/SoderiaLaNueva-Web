import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { Col, Modal, Row } from 'react-bootstrap';
import { Button, CellNumericInput, Loader, Table } from '../../../components';
import { handleChangePaymentMethods } from '../Routes.helpers';
import { formatCartProducts, formatCurrency, formatPaymentMethods } from '../../../app/Helpers';
import API from '../../../app/API';

const AddClientModal = forwardRef(({ disabled }, ref) => {
	const paymentMethodsTableColumns = [
		{
			name: 'label',
			text: 'Método',
			textCenter: true,
		},
		{
			name: 'amount',
			text: 'Cantidad',
			component: (props) => (<CellNumericInput {...props} maxValue={undefined} value={props.row.amount} onChange={(v) => handleChangePaymentMethods(props, v, paymentMethods, setPaymentMethods)} />),
			textCenter: true,
		},
	];

	const productColumns = [
		{
			name: 'description',
			text: 'Producto',
			textCenter: true,
		},
		{
			name: 'quantity',
			text: 'Cantidad',
			component: (props) => <CellNumericInput {...props} value={props.row.quantity} maxValue={undefined} onChange={(v) => handleProductsChange(props, v)} />,
			className: 'text-center',
		},
	];

	const [isVisible, setIsVisible] = useState(false);
	const [callbacks, setCallbacks] = useState(null);
	const [name, setName] = useState('');
	const [products, setProducts] = useState([]);
	const [paymentMethods, setPaymentMethods] = useState([]);

	useImperativeHandle(ref, () => ({
		open,
		close,
		confirm,
	}));

	const open = (onConfirm, onClose, name, id) => {
		setCallbacks({
			onConfirm,
			onClose,
		});
		setIsVisible(true);
		setName(name);
		API.get('client/getClientProducts', { id }).then((r) => {
			setProducts(formatCartProducts(r.data.products));
		});
	};

	const close = () => {
		setIsVisible(false);
		if (callbacks?.onClose) callbacks?.onClose();
	};

	const confirm = () => {
		if (callbacks?.onConfirm) callbacks?.onConfirm(products, paymentMethods);
	};

	const handleConfirm = () => {
		confirm();
	};

	const handleClose = () => {
		close();
	};

	const handleProductsChange = (props, v) => {
		setProducts(products.map(x => {
			if (x.id === props.row.id)
				return {
					...x,
					quantity: v,
				}
			return x;
		}))
	};

	useEffect(() => {
		API.get('cart/getPaymentMethodsCombo').then((r) => {
			setPaymentMethods(formatPaymentMethods(r.data.items));
		});
	}, [setPaymentMethods])

	if (!isVisible) return null;

	return (
		<Modal
			dialogClassName='modal-dialog-centered'
			size='lg'
			show={isVisible}
			onHide={handleClose}
			backdrop='static'
		>
			<Modal.Header>
				<Modal.Title>Confirmar bajada para {name}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Row>
					<Col xs={12}>
						<Table
							className='mt-1'
							rows={products}
							columns={productColumns}
						/>
					</Col>
					<Col xs={12} className='mb-3'>
						<h4>Total: {formatCurrency(products.reduce((sum, x) => sum + (x.quantity * x.price), 0))}</h4>
						<Table
							columns={paymentMethodsTableColumns}
							rows={paymentMethods}
						/>
					</Col>
				</Row>
			</Modal.Body>
			<Modal.Footer>
				<Button link onClick={handleClose}>
					Cancelar
				</Button>
				<Button onClick={handleConfirm} disabled={disabled}>
					{disabled ? <Loader /> : 'Confirmar bajada'}
				</Button>
			</Modal.Footer>
		</Modal>
	);
});

export default AddClientModal;
