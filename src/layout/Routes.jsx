import { Navigate, Outlet, Route, Routes } from 'react-router';
import { lazy, Suspense } from 'react';
import { Spinner } from '@components';
import App from '@app/App';

// Lazy loading de componentes
const ExpensesList = lazy(() => import('../screens/expenses/ExpenseList.jsx'));
const TransferList = lazy(() => import('../screens/transfers/TransferList.jsx'));
const SubscriptionList = lazy(() => import('../screens/subscriptions/SubscriptionList.jsx'));
const CreateSubscription = lazy(() => import('../screens/subscriptions/CreateSubscription.jsx'));
const CreateClient = lazy(() => import('../screens/clients/create/CreateClient.jsx'));
const ClientList = lazy(() => import('../screens/clients/ClientList.jsx'));
const RouteList = lazy(() => import('../screens/routes/RouteList.jsx'));
const EditRoute = lazy(() => import('../screens/routes/edit/EditRoute.jsx'));
const RouteDetails = lazy(() => import('../screens/routes/staticRouteDetails/StaticRouteDetails.jsx'));
const UpdateCart = lazy(() => import('../screens/carts/UpdateCart.jsx'));
const ClientDetails = lazy(() => import('../screens/clients/details/ClientDetails.jsx'));
const CreateRoute = lazy(() => import('../screens/routes/create/CreateRoute.jsx'));
const DynamicRouteDetails = lazy(() => import('../screens/routes/dynamicRouteDetails/DynamicRouteDetails.jsx'));
const Login = lazy(() => import('../screens/public/Login.jsx'));
const DefaultLayout = lazy(() => import('./DefaultLayout'));
const NotFound = lazy(() => import('../screens/public/NotFound.jsx'));
const NotAllowed = lazy(() => import('../screens/public/NotAllowed.jsx'));
const Home = lazy(() => import('../screens/main/Home.jsx'));
const CreateUser = lazy(() => import('../screens/users/CreateUser.jsx'));
const UserList = lazy(() => import('../screens/users/UserList.jsx'));
const CreateProduct = lazy(() => import('../screens/products/CreateProduct.jsx'));
const ProductList = lazy(() => import('../screens/products/ProductList.jsx'));
const DealerRouteList = lazy(() => import('../screens/routes/DealerRouteList.jsx'));
const AddClientList = lazy(() => import('../screens/routes/dynamicRouteDetails/AddClientList.jsx'));
const CreateTransfer = lazy(() => import('../screens/transfers/CreateTransfer.jsx'));
const GeneralStats = lazy(() => import('../screens/stats/GeneralStats.jsx'));

const PrivateRoute = () => (App.isLoggedIn() ? <Outlet /> : <Navigate to='/login' />);

const AdminRoute = () => (App.isAdmin() ? <Outlet /> : <Navigate to='/notAllowed' />);

const DealerRoute = () => (App.isDealer() ? <Outlet /> : <Navigate to='/notAllowed' />);

export const AppRoutes = () => (
	<Suspense
		fallback={
			<div
				className='d-flex justify-content-center align-items-center'
				style={{ minHeight: '100vh', backgroundColor: '#eef5f9' }}
			>
				<Spinner></Spinner>
			</div>
		}
	>
		<Routes>
			<Route path='/' element={<PrivateRoute />}>
				<Route
					path='/'
					element={
						<DefaultLayout>
							<Home />
						</DefaultLayout>
					}
				/>

				{/* Users */}
				<Route path='/usuarios' element={<AdminRoute />}>
					<Route
						path='/usuarios/list'
						element={
							<DefaultLayout>
								<UserList />
							</DefaultLayout>
						}
					/>
					<Route
						path='/usuarios/:id'
						element={
							<DefaultLayout>
								<CreateUser isWatching />
							</DefaultLayout>
						}
					/>
					<Route
						path='/usuarios/edit/:id'
						element={
							<DefaultLayout>
								<CreateUser isEditing />
							</DefaultLayout>
						}
					/>
					<Route
						path='/usuarios/new'
						element={
							<DefaultLayout>
								<CreateUser />
							</DefaultLayout>
						}
					/>
				</Route>

				{/* Products */}
				<Route path='/productos' element={<AdminRoute />}>
					<Route
						path='/productos/list'
						element={
							<DefaultLayout>
								<ProductList />
							</DefaultLayout>
						}
					/>
					<Route
						path='/productos/:id'
						element={
							<DefaultLayout>
								<CreateProduct isWatching />
							</DefaultLayout>
						}
					/>
					<Route
						path='/productos/edit/:id'
						element={
							<DefaultLayout>
								<CreateProduct isEditing />
							</DefaultLayout>
						}
					/>
					<Route
						path='/productos/new'
						element={
							<DefaultLayout>
								<CreateProduct />
							</DefaultLayout>
						}
					/>
				</Route>

				{/* Subscriptions */}
				<Route path='/abonos' element={<AdminRoute />}>
					<Route
						path='/abonos/list'
						element={
							<DefaultLayout>
								<SubscriptionList />
							</DefaultLayout>
						}
					/>
					<Route
						path='/abonos/:id'
						element={
							<DefaultLayout>
								<CreateSubscription isWatching />
							</DefaultLayout>
						}
					/>
					<Route
						path='/abonos/edit/:id'
						element={
							<DefaultLayout>
								<CreateSubscription isEditing />
							</DefaultLayout>
						}
					/>
					<Route
						path='/abonos/new'
						element={
							<DefaultLayout>
								<CreateSubscription />
							</DefaultLayout>
						}
					/>
				</Route>

				{/* Clients Admin*/}
				<Route path='/clientes' element={<AdminRoute />}>
					<Route
						path='/clientes/list'
						element={
							<DefaultLayout>
								<ClientList />
							</DefaultLayout>
						}
					/>
					<Route
						path='/clientes/:id'
						element={
							<DefaultLayout>
								<ClientDetails />
							</DefaultLayout>
						}
					/>
				</Route>

				{/* Clients Admin and Dealer*/}
				<Route path='/clientes' element={<PrivateRoute />}>
					<Route
						path='/clientes/new'
						element={
							<DefaultLayout>
								<CreateClient />
							</DefaultLayout>
						}
					/>
				</Route>

				{/* Planillas Admin */}
				<Route path='/planillas' element={<AdminRoute />}>
					<Route
						path='/planillas/list'
						element={
							<DefaultLayout>
								<RouteList />
							</DefaultLayout>
						}
					/>
					<Route
						path='/planillas/:id'
						element={
							<DefaultLayout>
								<RouteDetails />
							</DefaultLayout>
						}
					/>
					<Route
						path='/planillas/edit/:id'
						element={
							<DefaultLayout>
								<EditRoute isEditing />
							</DefaultLayout>
						}
					/>
					<Route
						path='/planillas/new'
						element={
							<DefaultLayout>
								<CreateRoute />
							</DefaultLayout>
						}
					/>

					<Route
						path='/planillas/bajada/:id'
						element={
							<DefaultLayout>
								<UpdateCart isEditing />
							</DefaultLayout>
						}
					/>
				</Route>
				
				{/* Planilla Admin y Dealer */}
				<Route path='/planillas' element={<PrivateRoute />}>
					<Route
						path='/planillas/abierta/:id'
						element={
							<DefaultLayout>
								<DynamicRouteDetails />
							</DefaultLayout>
						}
					/>
					<Route
						path='/planillas/agregarFueraReparto/'
						element={
							<DefaultLayout>
								<AddClientList />
							</DefaultLayout>
						}
					/>
				</Route>

				{/* Routes Dealer*/}
				<Route path='/planillas' element={<DealerRoute />}>
					<Route
						path='/planillas/misPlanillas'
						element={
							<DefaultLayout>
								<DealerRouteList />
							</DefaultLayout>
						}
					/>
				</Route>

				{/* Gastos */}
				<Route path='/gastos'>
					<Route
						path='/gastos/list'
						element={
							<DefaultLayout>
								<ExpensesList />
							</DefaultLayout>
						}
					/>
				</Route>

				{/* Transferencias */}
				<Route path='/transferencias' element={<AdminRoute />}>
					<Route
						path='/transferencias/list'
						element={
							<DefaultLayout>
								<TransferList />
							</DefaultLayout>
						}
					/>
					<Route
						path='/transferencias/new'
						element={
							<DefaultLayout>
								<CreateTransfer />
							</DefaultLayout>
						}
					/>
				</Route>

				{/* Stats */}
				<Route path='/estadisticas' element={<AdminRoute />}>
					<Route
						path='/estadisticas'
						element={
							<DefaultLayout>
								<GeneralStats />
							</DefaultLayout>
						}
					/>
				</Route>
			</Route>
			<Route path='*' element={<NotFound />} />
			<Route path='/notAllowed' element={<NotAllowed />} />
			<Route path='/notFound' element={<NotFound />} />
			<Route path='/login' element={<Login />} />
		</Routes>
	</Suspense>
);
