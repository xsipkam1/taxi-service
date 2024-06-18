import '../../styles/navbar.css'
import logoImage from '../../assets/logo1.jpg';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../security/AuthProvider';

export default function AdminNavbar() {
    const { logout } = useAuth();
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
                                <NavLink  to="/admin/overview" className="nav-link mx-3 fs-5" activeclassname="active">Prehľad</NavLink >
                            </li>
                            <li className="nav-item">
                                <NavLink  to="/admin/drivers" className="nav-link mx-3 fs-5" activeclassname="active">Vodiči</NavLink >
                            </li>
                            <li className="nav-item">
                                <NavLink  to="/admin/customers" className="nav-link mx-3 fs-5" activeclassname="active">Zákazníci</NavLink >
                            </li>
                            <li className="nav-item">
                                <a href="#" className="nav-link mx-3 fs-5" onClick={logout}>Odhlásiť sa</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
}
