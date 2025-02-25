import { useEffect, useRef, useState } from 'react';
import { Image } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faClose, faUser } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';
import { Button, Loader, SidePanel, Toast } from '@components';
import { LocalStorage } from '@app/LocalStorage';
import API from '@app/API';
import Logo from '../../assets/logo.png';
import LogoMini from '../../assets/logo-mini.png';

import './topbar.scss';

const TopBar = () => {
	const navigate = useNavigate();
	const [showUser, setShowUser] = useState(false);
	const [showSidePanel, setShowSidePanel] = useState(false);
	const [showNotifications, setShowNotifications] = useState(false);
	const [loading, setLoading] = useState(false);

	const userInfoRef = useRef(null);
	const notificationsRef = useRef(null);

	const handleShowUserInfo = () => {
		setShowNotifications(false);
		setShowUser(!showUser);
		if (userInfoRef.current)
			userInfoRef.current.focus();
	};

	const handleHideUserInfo = () => {
		setShowUser(false);
	};

	const handleGoHome = (e) => {
		e.preventDefault();
		navigate('/');
	};

	const toggleSidePanel = () => {
		setShowSidePanel(!showSidePanel);
	};

	const handleHideSidePanel = () => {
		setShowSidePanel(false);
	};

	const handleLogout = () => {
		setLoading(true);
		API.post('auth/logout', null)
			.then(() => {
				LocalStorage.clearSessionData();
				window.location.href = '/login';
			})
			.catch((r) => {
				Toast.error(r.error?.message);
			})
			.finally(() => {
				setLoading(false);
			});
	};

	const handlePerfilDetails = () => {
		setShowUser(false);
		navigate(`/usuarios/${LocalStorage.getUserId()}`)
	};

	// Handle click outside of notifications container
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
				setShowNotifications(false);
			}
		};

		if (showNotifications) {
			document.addEventListener('mousedown', handleClickOutside);
		} else {
			document.removeEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [showNotifications]);

	// Handle click outside of user info container
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (userInfoRef.current && !userInfoRef.current.contains(event.target)) {
				setShowUser(false);
			}
		};

		if (showUser) {
			document.addEventListener('mousedown', handleClickOutside);
		} else {
			document.removeEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [showUser]);

	return (
		<>
			<SidePanel isOpen={showSidePanel} onClose={handleHideSidePanel} />
			<nav className='custom-topbar'>
				<div className='image-container'>
					<a href='/' onClick={handleGoHome}>
						<Image src={Logo} className='logo' alt='Inicio' />
						<Image src={LogoMini} className='logo-mini' alt='Inicio' />
					</a>
					<div className='bars-container'>
						<FontAwesomeIcon icon={faBars} size='lg' className='menu-icon' onClick={toggleSidePanel} />
					</div>
				</div>
				<div className='d-flex flex-row'>
					<span className={classNames('icon-container', showUser && 'show-card')} onClick={handleShowUserInfo}>
						<FontAwesomeIcon icon={faUser} size='xl' />
					</span>
				</div>
				<div className={classNames('user-container', showUser && 'show-card')} ref={userInfoRef} onBlur={handleHideUserInfo}>
					<FontAwesomeIcon icon={faClose} size='sm' className='close-dialog' onClick={handleHideUserInfo} />
					<div className='user-info'>
						<div className='user-icon'>
							<FontAwesomeIcon icon={faUser} size='xl' />
						</div>
						<div className='user-data'>
							<h5>{LocalStorage.getUserName()}</h5>
							<h6>{LocalStorage.getUserEmail()}</h6>
							<small>Rol: {LocalStorage.getUserRole()}</small>
						</div>
					</div>
					<div>
						<Button className='perfil-details-badge' type="button" onClick={handlePerfilDetails} >
							Ver perfil
						</Button>
						<hr />
						<Button className='logout-badge' type="button" onClick={handleLogout} disabled={loading}>
							{loading ? <Loader /> : 'Cerrar sesión'}
						</Button>
					</div>
				</div>
			</nav>
		</>
	);
};

export default TopBar;