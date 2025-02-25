import { Button } from "@components";

const CellButton = ({
	onClick,
	children,
}) => {
	return <Button onClick={onClick}>
		{children}
	</Button>
};

export default CellButton;
