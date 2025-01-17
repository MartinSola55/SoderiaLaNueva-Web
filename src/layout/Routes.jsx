import { Navigate, Outlet, Route, Routes } from 'react-router';
import { lazy, Suspense } from 'react';
import App from '../app/App.js';
import { Spinner } from '../components/index.jsx';
import ExpensesList from '../screens/expenses/ExpenseList.jsx';
import TransferList from '../screens/transfers/TransferList.jsx';
import SubscriptionList from '../screens/subscriptions/SubscriptionList.jsx';
import CreateSubscription from '../screens/subscriptions/CreateSubscription.jsx';
import CreateClient from '../screens/clients/create/CreateClient.jsx';
import ClientList from '../screens/clients/ClientList.jsx';
import RouteList from '../screens/routes/RouteList.jsx';
import CreateRoute from '../screens/routes/CreateRoute.jsx';
import EditRoute from '../screens/routes/EditRoute.jsx';
import RouteDetails from '../screens/routes/StaticRouteDetails.jsx';
import DynamicRouteDetails from '../screens/routes/DynamicRouteDetails.jsx';
import CreateCart from '../screens/carts/CreateCart.jsx';
import ClientDetails from '../screens/clients/details/ClientDetails.jsx';

// Lazy loading de componentes
const Login = lazy(() => import('../screens/public/Login.jsx'));
const DefaultLayout = lazy(() => import('./DefaultLayout'));
const NotFound = lazy(() => import('../screens/public/NotFound.jsx'));
const NotAllowed = lazy(() => import('../screens/public/NotAllowed.jsx'));
const Home = lazy(() => import('../screens/main/Home.jsx'));
const CreateUser = lazy(() => import('../screens/users/CreateUser.jsx'));
const UserList = lazy(() => import('../screens/users/UserList.jsx'));
const CreateProduct = lazy(() => import('../screens/products/CreateProduct.jsx'));
const ProductList = lazy(() => import('../screens/products/ProductList.jsx'));

const PrivateRoute = () => (App.isLoggedIn() ? <Outlet /> : <Navigate to='/login' />);

const AdminRoute = () => (App.isAdmin() ? <Outlet /> : <Navigate to='/notAllowed' />);

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

                {/* Clients */}
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
                    <Route
                        path='/clientes/new'
                        element={
                            <DefaultLayout>
                                <CreateClient />
                            </DefaultLayout>
                        }
                    />
                </Route>

                {/* Routes */}
                <Route path='/planillas' element={<AdminRoute />}>
                    <Route
                        path='/planillas/list'
                        element={
                            <DefaultLayout>
                                <RouteList />
                            </DefaultLayout>
                        }
                    />
                    {/* // TODO */}
                    {/* <Route
                        path='/planillas/:id'
                        element={
                            <DefaultLayout>
                                <EditRoute isWatching />
                            </DefaultLayout>
                        }
                    /> */}
                    <Route
                        path='/planillas/:id'
                        element={
                            <DefaultLayout>
                                <RouteDetails />
                            </DefaultLayout>
                        }
                    />
                    <Route
                        path='/planillas/abierta/:id'
                        element={
                            <DefaultLayout>
                                <DynamicRouteDetails />
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
                </Route>

                {/* Carts */}
                <Route path='/bajadas' element={<AdminRoute />}>
                    <Route
                        path='/bajadas/:id'
                        element={
                            <DefaultLayout>
                                <CreateCart isEditing />
                            </DefaultLayout>
                        }
                    />
                </Route>

                {/* Gastos */}
                <Route path='/gastos' element={<AdminRoute />}>
                    <Route
                        path='/gastos/list'
                        element={
                            <DefaultLayout>
                                <ExpensesList />
                            </DefaultLayout>
                        }
                    />
                    <Route
                        path='/gastos/:id'
                        element={
                            <DefaultLayout>
                                <CreateProduct isWatching />
                            </DefaultLayout>
                        }
                    />
                    <Route
                        path='/gastos/edit/:id'
                        element={
                            <DefaultLayout>
                                <CreateProduct isEditing />
                            </DefaultLayout>
                        }
                    />
                    <Route
                        path='/gastos/new'
                        element={
                            <DefaultLayout>
                                <CreateProduct />
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
                        path='/transferencias/:id'
                        element={
                            <DefaultLayout>
                                <CreateProduct isWatching />
                            </DefaultLayout>
                        }
                    />
                    <Route
                        path='/transferencias/edit/:id'
                        element={
                            <DefaultLayout>
                                <CreateProduct isEditing />
                            </DefaultLayout>
                        }
                    />
                    <Route
                        path='/transferencias/new'
                        element={
                            <DefaultLayout>
                                <CreateProduct />
                            </DefaultLayout>
                        }
                    />
                </Route>
            </Route>
            <Route path='*' element={<NotFound />} />
            <Route path='/notAllowed' element={<NotAllowed />} />
            <Route path='/login' element={<Login />} />
        </Routes>
    </Suspense>
);
