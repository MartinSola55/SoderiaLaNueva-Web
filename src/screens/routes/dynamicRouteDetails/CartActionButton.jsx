import { Button } from "../../../components"
import { Dropdown } from 'react-bootstrap';
import { CartStatuses } from "../../../constants/Cart";
import { openActionConfirmationModal } from "../../../app/Helpers";


export const CartActionButton= ({actionConfirmationRef, setForm, cart}) => {
    const handleOpenUpdateCartStatus = (value, cartId, message = '') => {
		openActionConfirmationModal(
			actionConfirmationRef, 
			{
				id: cartId,
				status: value
			},
			'Cart/UpdateStatus',
			`¿Está seguro que el cliente ${message}?`,
			null,
			() => {
				setForm(prevForm => ({
					...prevForm,
					carts: prevForm.carts.map(cart =>
						cart.id === cartId
							? { ...cart, status: value }
							: cart
					),
				}));
			}
		)
    };

	return (
		<Dropdown className='ms-auto'>
			<Dropdown.Toggle as={Button} variant="primary" id="dropdown-basic">
				Acción
			</Dropdown.Toggle>

			<Dropdown.Menu align="top">
				<Dropdown.Item onClick={() => handleOpenUpdateCartStatus(CartStatuses.Absent, cart.id, 'estaba ausente')}>{CartStatuses.Absent}</Dropdown.Item>
				<Dropdown.Item onClick={() => handleOpenUpdateCartStatus(CartStatuses.DidNotNeed, cart.id, 'no necesitaba')}>{CartStatuses.DidNotNeed}</Dropdown.Item>
				<Dropdown.Item onClick={() => handleOpenUpdateCartStatus(CartStatuses.Holiday, cart.id, 'estaba de vacaciones')}>{CartStatuses.Holiday}</Dropdown.Item>
			</Dropdown.Menu>
		</Dropdown>
	)
}