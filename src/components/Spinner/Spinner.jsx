import './spinner.scss'

const Spinner = ({ black = true }) => {
    return (
        <div className='spinner-container'>
            <span className={`spinner ${black ? 'black' : 'white'}`}></span>
        </div>
    );
};

export default Spinner;