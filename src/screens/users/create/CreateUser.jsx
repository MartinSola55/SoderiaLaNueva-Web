import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Col, Row } from 'react-bootstrap';
import { BreadCrumb, ChangePasswordModal, Toast, } from '@components';
import API from '@app/API';
import App from '@app/App';
import { Messages } from '@constants/Messages';
import { InitialFormStates } from '@app/InitialFormStates';
import { Dates } from '@app/Helpers';
import { UserInfo } from '../cards/UserInfo';
import { DealerMonthlyStats } from '../cards/DealerMonthlyStats';
import { SoldProducts } from '../cards/SoldProducts';
import { ClientsDebt } from '../cards/ClientsDebt';
import { Roles } from '@constants/Roles';
import { ClientStock } from '../cards/ClientStock';
import { NonVisited } from '../cards/NonVisited';
import { getBreadcrumbItems, validateUser } from '../User.helpers';

const initialForm = InitialFormStates.User;

const CreateUser = ({ isWatching = false, isEditing = false, viewProfileDetails = false }) => {
	const navigate = useNavigate();

	const modalRef = useRef();
	const params = useParams();
	const id = (params && params.id) || null;

	const [form, setForm] = useState(initialForm);
	const [submitting, setSubmitting] = useState(false);
	const [loading, setLoading] = useState(id ? true : false);

	// Get form data
	useEffect(() => {
		if (id) {
			API.get('user/getOneById', { id })
				.then((r) => {
					setForm(() => ({
						...r.data,
						date: Dates.getTomorrow(r.data.date),
						phoneNumber: r.data.phoneNumber || '',
					}));
					setLoading(false);
				})
				.catch(() => {
					navigate('/notFound');
				});
		}
	}, [id, navigate, viewProfileDetails]);

	const handleSubmit = async () => {
		if (submitting)
			return;

		if (!validateUser(form, viewProfileDetails, isEditing)) {
			Toast.warning(Messages.Validation.requiredFields);
			return;
		}

		setSubmitting(true);

		const rq = {
			fullName: form.fullName,
			email: form.email,
			password: form.password,
			phoneNumber: form.phoneNumber,
			roleId: form.role,
		};

		if (id) {
			rq.id = id;
		}

		API.post(`user/${id ? 'update' : 'create'}`, rq)
			.then((r) => {
				Toast.success(r.message);
				navigate('/usuarios/list');
			})
			.catch((r) => {
				Toast.error(r.error?.message);
			})
			.finally(() => {
				setSubmitting(false);
			});
	};

	const handleInputChange = (value, field) => {
		setForm((prevForm) => {
			return {
				...prevForm,
				[field]: value,
			};
		});
	};
	const handleChangePassword = () => {
		modalRef.current.open(id);
	};
	return (
		<>
			<BreadCrumb items={getBreadcrumbItems(isWatching, id, viewProfileDetails)} title='Usuarios' />
			<ChangePasswordModal ref={modalRef} />
			<div>
				<Col xs={11} className='container'>
					<UserInfo
						id={id}
						form={form}
						loading={loading}
						submitting={submitting}
						onSubmit={handleSubmit}
						isWatching={isWatching}
						onInputChange={(v, n) => handleInputChange(v, n, setForm)}
						handleChangePassword={handleChangePassword}
						viewProfileDetails={viewProfileDetails}
					/>
					{isWatching && form.roleName === Roles.Dealer && App.isAdmin() && (
						<div className='dealer-stats'>
							<hr />
							<DealerMonthlyStats
								id={id}
							/>
							<Row>
								<SoldProducts id={id} />
								<ClientsDebt id={id} />
								<ClientStock id={id} />
								<NonVisited id={id} />
							</Row>
						</div>
					)}
				</Col>
			</div>
		</>
	);
};

export default CreateUser;
