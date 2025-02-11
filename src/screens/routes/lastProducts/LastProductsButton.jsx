import { faClipboard } from '@fortawesome/free-solid-svg-icons';
import '../route.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const LastProductsButton = ({ onClick = () => {} }) => {
    return (
		<span onClick={onClick} className='btn-last-products'>
			<FontAwesomeIcon color='white' icon={faClipboard}/>
		</span>
    );
};

export default LastProductsButton;
