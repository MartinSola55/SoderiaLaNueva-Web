import { BreadCrumb } from '../../components';

const Home = () => {
    return (
        <>
            <BreadCrumb title='Inicio' />
            <div className='d-flex justify-content-center'>
                <div className='col-12 text-center mt-2'>
                    <h1 className='fw-bold '>¡Bienvenido a Sodería la Nueva!</h1>
                </div>
            </div>
        </>
    );
};

export default Home;
