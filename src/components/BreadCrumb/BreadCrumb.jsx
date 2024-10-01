import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import './breadcrumb.scss';

const BreadCrumb = ({ title, items, children }) => {
    return (
        <Nav className='breadcrumb-container shadow'>
            <div className='d-flex flex-column'>
                <h3 className="breadcrumb-title">{title}</h3>
                <ol className="breadcrumb">
                    {items ? <li className="breadcrumb-item"><Link to="/">Inicio</Link></li> : <li className="breadcrumb-item active">Inicio</li>}
                    {items && items.map((item, i) => (
                        <li key={i} className={`breadcrumb-item ${item.active ? 'active' : ''}`}>
                            {item.active ? <span>{item.label}</span> : <Link to={item.url}>{item.label}</Link>}
                        </li>
                    ))}
                </ol>
            </div>
            <div className='d-flex flex-column ms-auto my-auto'>
                {children}
            </div>
        </Nav>
    );
};

export default BreadCrumb;