import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBriefcase, faFileAlt, faHouse, faListOl, faPenSquare, faUsers } from "@fortawesome/free-solid-svg-icons";
import App from "../../app/App";

import "./SidePanel.scss";

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
            </div>
        </div>
    );
};

export default SidePanel;
