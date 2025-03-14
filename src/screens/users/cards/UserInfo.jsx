import { Col, Row } from "react-bootstrap";
import { Button, Card, Input, Label, Loader, RolesDropdown, Spinner } from "@components";

import './dealerStats.scss';

export const UserInfo = ({
	id,
	form,
	loading,
	submitting,
	isWatching,
	onSubmit,
	onInputChange,
	handleChangePassword,
	viewProfileDetails
}) => {

	return (
		<Card
			title='Usuario'
			body={
				loading ? (
					<Spinner />
				) : (
					<>
						<Row className='align-items-center'>
							<Col xs={12} md={4} className='pe-3 mb-3'>
								<Label required={!isWatching || !viewProfileDetails}>Nombre completo</Label>
								<Input
									disabled={isWatching || viewProfileDetails}
									placeholder='Nombre completo'
									value={form.fullName}
									onChange={(value) =>
										onInputChange(value, 'fullName')
									}
								/>
							</Col>
							<Col xs={12} md={4} className='pe-3 mb-3'>
								<Label required={!isWatching}>Número de teléfono</Label>
								<Input
									disabled={isWatching}
									numeric
									isPhone
									placeholder='Número de teléfono'
									value={form.phoneNumber}
									onChange={(value) =>
										onInputChange(value, 'phoneNumber')
									}
								/>
							</Col>
							<Col xs={12} md={4} className='pe-3 mb-3'>
								<Label required={!isWatching || !viewProfileDetails}>Rol</Label>
								<RolesDropdown
									disabled={isWatching || viewProfileDetails}
									placeholder='Seleccione un rol'
									required
									value={form.role}
									onChange={(value) => onInputChange(value, 'role')}
								/>
							</Col>
						</Row>
						<Row>
							<Col xs={12} md={6} className='pe-3 mb-3'>
								<Label required={!isWatching || !viewProfileDetails}>Email</Label>
								<Input
									disabled={isWatching || viewProfileDetails}
									type='email'
									placeholder='Email'
									value={form.email}
									onChange={(value) =>
										onInputChange(value, 'email')
									}
								/>
							</Col>
							{!viewProfileDetails && !id && (
								<Col xs={12} md={6} className='pe-3 mb-3'>
									<Label required={!isWatching}>Contraseña</Label>
									<Input
										disabled={isWatching}
										placeholder='Contraseña'
										type='password'
										value={form.password}
										onChange={(value) =>
											onInputChange(value, 'password')
										}
									/>
								</Col>
							)}
						</Row>
					</>
				)
			}
			footer={
				!isWatching && (
					<div className='d-flex justify-content-end'>
						{id && (
							<Button
								onClick={handleChangePassword}
								className='me-auto'
								style={{
									backgroundColor: 'rgb(143, 162, 188)',
									borderColor: 'rgb(143, 162, 188)',
								}}
							>
								Cambiar contraseña
							</Button>
						)}
						<Button onClick={onSubmit} disabled={submitting}>
							{submitting ? <Loader /> : id ? 'Actualizar' : 'Enviar'}
						</Button>
					</div>
				)
			}
		/>
	);
};