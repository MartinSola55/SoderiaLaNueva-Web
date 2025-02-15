import Button from "../../Button/Button";

const CellButton = ({
    onClick,
	children,
}) => {
    return <Button onClick={onClick}>
				{children}
			</Button>
};

export default CellButton;
