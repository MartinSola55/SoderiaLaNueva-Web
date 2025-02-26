import { Input } from "@components";

const CellNumericInput = ({
	value,
	maxValue = 100,
	onChange = () => { },
	...props
}) => {
	return <Input
		type='number'
		value={value}
		minValue={0}
		maxValue={maxValue}
		placeholder='Cantidad'
		onChange={onChange}
		{...props}
	/>
};

export default CellNumericInput;