import { CheckBox } from "@components";

const CellCheck = ({
	checked,
	onChange,
	...props
}) => {
	return <CheckBox
		checked={checked}
		onChange={onChange}
		{...props}
	/>
};

export default CellCheck;