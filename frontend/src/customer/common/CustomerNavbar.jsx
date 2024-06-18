import '../../styles/navbar.css';
import logoImage from '../../assets/logo1.jpg';
import { NavLink } from 'react-router-dom';

export default function CustomerNavbar() {
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
                                <NavLink to="/customer/newride" className="nav-link mx-3 fs-5" activeclassname="active">Nová jazda</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/customer/activerides" className="nav-link mx-3 fs-5" activeclassname="active">Aktívne jazdy</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/customer/pastrides" className="nav-link mx-3 fs-5" activeclassname="active">História jázd</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/customer/myprofile" className="nav-link mx-3 fs-5" activeclassname="active">Môj profil</NavLink>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
}
