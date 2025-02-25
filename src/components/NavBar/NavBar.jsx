import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBank, faBoxOpen, faCalendarAlt, faChartLine, faClipboard, faHouse, faMoneyBill, faTruck, faUserCircle, faUsersRectangle } from '@fortawesome/free-solid-svg-icons';
import { Tooltip } from '@components';
import App from '@app/App';

import './navbar.scss';

const NavBar = () => {
	return (
		<aside className='custom-navbar'>
			<ul>
				<li className='mt-3'>
					<Tooltip text='Inicio' placement='right'>
						<Link to='/'>
							<FontAwesomeIcon icon={faHouse} />
						</Link>
					</Tooltip>
				</li>
				{App.isAdmin() && (
					<>
						<li className='mt-3'>
							<Tooltip text='Productos' placement='right'>
								<Link to='/productos/list'>
									<FontAwesomeIcon icon={faBoxOpen} />
								</Link>
							</Tooltip>
						</li>
						<li className='mt-3'>
							<Tooltip text='Abonos' placement='right'>
								<Link to='/abonos/list'>
									<FontAwesomeIcon icon={faClipboard} />
								</Link>
							</Tooltip>
						</li>
						<li className='mt-3'>
							<Tooltip text='Clientes' placement='right'>
								<Link to='/clientes/list'>
									<FontAwesomeIcon icon={faUsersRectangle} />
								</Link>
							</Tooltip>
						</li>
						<hr className='mx-3 my-3' style={{ color: 'white' }} />
						<li className='mt-3'>
							<Tooltip text='Planillas' placement='right'>
								<Link to='/planillas/list'>
									<FontAwesomeIcon icon={faCalendarAlt} />
								</Link>
							</Tooltip>
						</li>
						<li className='mt-3'>
							<Tooltip text='Repartidores' placement='right'>
								<Link to='/usuarios/list'>
									<FontAwesomeIcon icon={faTruck} />
								</Link>
							</Tooltip>
						</li>
						<li className='mt-3'>
							<Tooltip text='Transferencias' placement='right'>
								<Link to='/transferencias/list'>
									<FontAwesomeIcon icon={faBank} />
								</Link>
							</Tooltip>
						</li>
						<li className='mt-3'>
							<Tooltip text='Gastos' placement='right'>
								<Link to='/gastos/list'>
									<FontAwesomeIcon icon={faMoneyBill} />
								</Link>
							</Tooltip>
						</li>
						<hr className='mx-3 my-3' style={{ color: 'white' }} />
						<li className='mt-3'>
							<Tooltip text='Estadísticas' placement='right'>
								<Link to='/estadisticas'>
									<FontAwesomeIcon icon={faChartLine} />
								</Link>
							</Tooltip>
						</li>
					</>
				)}
				{App.isDealer() && (
					<>
						<hr className='mx-3 my-3' style={{ color: 'white' }} />
						<li className='mt-3'>
							<Tooltip text='Mis planillas' placement='right'>
								<Link to='/planillas/misPlanillas'>
									<FontAwesomeIcon icon={faClipboard} />
								</Link>
							</Tooltip>
						</li>
						<li className='mt-3'>
							<Tooltip text='Agregar cliente' placement='right'>
								<Link to='/clientes/new'>
									<FontAwesomeIcon icon={faUserCircle} />
								</Link>
							</Tooltip>
						</li>
						<li className='mt-3'>
							<Tooltip text='Gastos' placement='right'>
								<Link to='/gastos/list'>
									<FontAwesomeIcon icon={faMoneyBill} />
								</Link>
							</Tooltip>
						</li>
					</>
				)}
			</ul>
		</aside>
	);
};

export default NavBar;
