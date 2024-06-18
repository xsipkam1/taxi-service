import '../../styles/navbar.css'
import logoImage from '../../assets/logo1.jpg';
import { NavLink } from 'react-router-dom';

export default function DriverNavbar() {
    return (
        <header>
            <nav className="navbar navbar-expand-md border" style={{ backgroundColor: 'white' }}>
                <div className="container-fluid">
                    <div className="navbar-brand logo p-0">
                        <img src={logoImage} alt="logo" />
                    </div>
                    <button className="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#nav" aria-controls="nav" aria-label="Expand">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="nav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <NavLink to="/driver/orders" className="nav-link mx-3 fs-5" activeclassname="active">Objednávky</NavLink >
                            </li>
                            <li className="nav-item">
                                <NavLink to="/driver/pastrides" className="nav-link mx-3 fs-5" activeclassname="active">História jázd</NavLink >
                            </li>
                            <li className="nav-item">
                                <NavLink to="/driver/myprofile" className="nav-link mx-3 fs-5" activeclassname="active">Môj profil</NavLink >
                            </li>
                        </ul>
                    </div>

                </div>
            </nav>
        </header>
    );
}