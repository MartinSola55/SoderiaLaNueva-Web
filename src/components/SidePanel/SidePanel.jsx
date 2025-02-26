import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBank, faBoxOpen, faCalendarAlt, faChartLine, faClipboard, faHouse, faMoneyBill, faTruck, faUserCircle, faUsersRectangle } from "@fortawesome/free-solid-svg-icons";

import "./SidePanel.scss";
import App from "@app/App";

const SidePanel = ({
	isOpen = false,
	onClose = () => { },
}) => {
	const navigate = useNavigate();

	const handleItemClick = (link) => {
		navigate(link);
		onClose();
	};

    return (
        <div>
            <div className={`overlay ${isOpen ? "show" : ""}`} onClick={onClose}></div>
            <div className={`side-panel ${isOpen ? "open" : ""}`}>
                <span className="item-container" onClick={() => handleItemClick('/')}>
                    <FontAwesomeIcon icon={faHouse} /> Inicio
                </span>
                <hr className="my-3" />
				{App.isAdmin() && (
                    <>
 						<span className="item-container d-block" onClick={() => handleItemClick('/productos/list')}>
							<FontAwesomeIcon icon={faBoxOpen} /> Productos
						</span>
                        <span className="item-container d-block" onClick={() => handleItemClick('/abonos/list')}>
                            <FontAwesomeIcon icon={faClipboard} /> Abonos
                        </span>
                        <span className="item-container d-block" onClick={() => handleItemClick('/clientes/list')}>
                            <FontAwesomeIcon icon={faUsersRectangle} /> Clientes
                        </span>
                        <span className="item-container d-block" onClick={() => handleItemClick('/planillas/list')}>
                            <FontAwesomeIcon icon={faCalendarAlt} /> Planillas
                        </span>
                        <span className="item-container d-block" onClick={() => handleItemClick('/usuarios/list')}>
                            <FontAwesomeIcon icon={faTruck} /> Repartidores
                        </span>
                        <span className="item-container d-block" onClick={() => handleItemClick('/transferencias/list')}>
                            <FontAwesomeIcon icon={faBank} /> Transferencias
                        </span>
                        <span className="item-container d-block" onClick={() => handleItemClick('/gastos/list')}>
                            <FontAwesomeIcon icon={faMoneyBill} /> Gastos
                        </span>
						<hr className='mx-3 my-3' style={{ color: 'white' }} />
                        <span className="item-container d-block" onClick={() => handleItemClick('/estadisticas')}>
                            <FontAwesomeIcon icon={faChartLine} /> Estadísticas
                        </span>
                    </>
                )}
                {App.isDealer() && (
                    <>
                        <hr className="my-3" />
                        <span className="item-container d-block" onClick={() => handleItemClick('/planillas/misPlanillas')}>
                            <FontAwesomeIcon icon={faClipboard} /> Mis planillas
                        </span>
                        <span className="item-container d-block" onClick={() => handleItemClick('/clientes/new')}>
                            <FontAwesomeIcon icon={faUserCircle} /> Agregar cliente
                        </span>
                        <span className="item-container d-block" onClick={() => handleItemClick('/gastos/list')}>
                            <FontAwesomeIcon icon={faMoneyBill} /> Gastos
                        </span>
                    </>
                )}
            </div>
        </div>
    );
};

export default SidePanel;
