import './footer.scss';

const Footer = () => {
    return (
        <div className='custom-footer shadow'>
            <footer>
                <span className='mx-auto'>Sodería la nueva &copy; - {new Date().getFullYear()}</span>
            </footer>
        </div>
    );
};

export default Footer;