import { useState } from "react";
import { Card, CardBody, Col } from "react-bootstrap";
import { useNavigate } from "react-router";
import { ToastContainer } from 'react-toastify';
import { Button, Input, Label, Loader, Toast } from "@components";
import API from "@app/API";
import { Messages } from "@constants/Messages";
import { LocalStorage } from "@app/LocalStorage";

import "react-toastify/dist/ReactToastify.css";
import './login.scss';

const Login = () => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [form, setForm] = useState({
		email: '',
		password: '',
	});

	const handleInputChange = (value, input) => {
		setForm({ ...form, [input]: value });
	};

	const handleSubmit = () => {
		if (loading)
			return;

		if (!form.email || !form.password) {
			Toast.warning(Messages.Validation.requiredFields);
			return;
		}

		setLoading(true);
		API.post('auth/login', form)
			.then((response) => {
				handleLogin(response.data);
				navigate('/');
			})
			.catch((r) => {
				Toast.error(r.error?.message);
			})
			.finally(() => {
				setLoading(false);
			});
	};

	const handleLogin = (data) => {
		LocalStorage.setToken(data.token);
		LocalStorage.setUserId(data.user.id);
		LocalStorage.setUserRole(data.user.role);
		LocalStorage.setUserName(data.user.fullName);
		LocalStorage.setUserEmail(data.user.email);
		LocalStorage.setSessionExpiration(data.sessionExpiration);
	}

	return (
		<>
			<ToastContainer />
			<div className="d-flex login-container px-4">
				<Card className="shadow mx-auto my-auto card-container">
					<h3 className="text-center mt-4">Iniciar sesión</h3>
					<CardBody>
						<Col xs={12}>
							<Label>Email</Label>
							<Input
								type="email"
								value={form.email}
								onChange={(value) => handleInputChange(value, 'email')}
								submitOnEnter
								onSubmit={handleSubmit}
							/>
						</Col>
						<Col xs={12} className="mt-4 pb-4">
							<Label>Contraseña</Label>
							<Input
								type="password"
								value={form.password}
								onChange={(value) => handleInputChange(value, 'password')}
								submitOnEnter
								onSubmit={handleSubmit}
							/>
						</Col>
						<Col xs={12} className="d-flex mt-4">
							<Button className="w-100" onClick={handleSubmit} disabled={loading}>
								{loading ? <Loader /> : 'ACCEDER'}
							</Button>
						</Col>
					</CardBody>
				</Card>
			</div>
		</>
	);
};

export default Login;