import { Button } from "../../../components"
import { Dropdown } from 'react-bootstrap';
import { CartStatuses } from "../../../constants/Cart";

export const CartActionButton = ({
	onOpenUpdateCartStatus = () => { },
}) => {
	return (
		<Dropdown className='ms-auto'>
			<Dropdown.Toggle as={Button} variant="primary" id="dropdown-basic">
				Acción
			</Dropdown.Toggle>

			<Dropdown.Menu align="top">
				<Dropdown.Item onClick={() => onOpenUpdateCartStatus(CartStatuses.Absent, 'estaba ausente')}>{CartStatuses.Absent}</Dropdown.Item>
				<Dropdown.Item onClick={() => onOpenUpdateCartStatus(CartStatuses.DidNotNeed, 'no necesitaba')}>{CartStatuses.DidNotNeed}</Dropdown.Item>
				<Dropdown.Item onClick={() => onOpenUpdateCartStatus(CartStatuses.Holiday, 'estaba de vacaciones')}>{CartStatuses.Holiday}</Dropdown.Item>
			</Dropdown.Menu>
		</Dropdown>
	)
}