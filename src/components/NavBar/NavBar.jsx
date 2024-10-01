import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import Tooltip from "../Tooltip/Tooltip";
import { Link } from "react-router-dom";

import "./navbar.scss";

const NavBar = () => {
    return (
        <aside className="custom-navbar">
            <ul>
                <li className="mt-3">
                    <Tooltip text="Inicio" placement="right">
                        <Link to="/"><FontAwesomeIcon icon={faHouse} /></Link>
                    </Tooltip>
                </li>
                <hr className="mx-3 my-3" style={{ color: 'white' }} />
            </ul>
        </aside>
    );
};

export default NavBar;