import { Button } from '../../components';
import { faClipboard } from '@fortawesome/free-solid-svg-icons';
import './route.scss';
import classNames from 'classnames';

const LastProductsButton = ({ onClick = () => {}, className }) => {
    return (
        <Button
            icon={faClipboard}
            className={classNames(className, 'btn-last-products')}
            style={{
                minWidth: '45px',
            }}
            iconStyle={{
                marginLeft: '0px',
            }}
            onClick={() => onClick()}
        />
    );
};

export default LastProductsButton;
