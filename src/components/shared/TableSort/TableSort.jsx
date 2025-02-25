import { useState } from 'react';
import { Dropdown } from '@components';

const defaultItems = [
	{ value: 'date-asc', label: 'Fecha - Asc.' },
	{ value: 'date-desc', label: 'Fecha - Desc.' },
	{ value: 'createdAt-asc', label: 'Creado - Asc.' },
	{ value: 'createdAt-desc', label: 'Creado - Desc.' },
];

const TableSort = ({
	items = defaultItems,
	onChange = () => { },
}) => {
	const [selectedItem, setSelectedItem] = useState(null);

	const handleItemChange = (item) => {
		setSelectedItem(item);

		if (!item) {
			onChange({ column: null, direction: null });
			return;
		}

		const [column, direction] = item.value.split('-');
		onChange({ column, direction });
	};

	return (
		<Dropdown
			items={items}
			value={selectedItem && selectedItem.value}
			placeholder="Ordenar por"
			clearable
			onChange={handleItemChange}
		/>
	);
};

export default TableSort;