import Input from "../../Input/Input";

const CellNumericInput = ({
    value,
    onChange,
    ...props
}) => {
    return <Input
        type='number'
        value={value}
        minValue={0}
        placeholder='Cantidad'
        onChange={onChange}
        {...props}
    />
};

export default CellNumericInput;