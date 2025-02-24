import { useCallback, useEffect, useState } from 'react';
import { CellButton, Table, Toast } from '@components';
import { Messages } from '@constants/Messages';
import { debounce } from '@app/Helpers';
import { getClients } from './Transfers.helpers';
import { clientColumns } from './Transfers.data';

export const ClientsTable = ({
	clientName = '',
	onClientClick = () => { },
}) => {
	const columns = [
		...clientColumns,
		{
			name: 'actions',
			text: 'Acciones',
			className: 'text-center',
			component: (props) => <CellButton {...props} onClick={() => onClientClick(props.row)}>Seleccionar</CellButton>,
		},
	];

	// State
	const [rows, setRows] = useState([]);
	const [loading, setLoading] = useState(false);

	// Private
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const searchClient = useCallback(debounce((name) => {
		setLoading(true);
		getClients(name, (clients) => {
			setRows(clients);
			if (clients.length === 0) {
				Toast.warning(Messages.Error.noRows);
			}
			setLoading(false);
		});
	}, 1000), []);

	// Effects
	useEffect(() => {
		if (clientName.length >= 3)
			searchClient(clientName);
	}, [clientName, searchClient]);

	return (
		<Table
			className='mb-5'
			columns={columns}
			rows={rows}
			loading={loading}
			emptyTableMessage='No se encontraron clientes que coincidan con la búsqueda.'
		/>
	);
};