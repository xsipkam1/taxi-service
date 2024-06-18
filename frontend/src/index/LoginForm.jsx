import '../styles/form.css'
import { useState } from 'react';
import axios from '../security/CrossOrigin';
import ResponseModal from '../common/ResponseModal';
import { useAuth } from '../security/AuthProvider';

export default function LoginForm({ handleRegistrationClick, handleExitClick }) {
    const { login } = useAuth();
    const [message, setMessage] = useState("");
    const [title, setTitle] = useState("");
    const [responseModalShow, setResponseModalShow] = useState(false);

    const [loginData, setLoginData] = useState({
        login: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginData({ ...loginData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("/auth/login", loginData);
            login(response.data);
        } catch (err) {
            if (!err?.response) {
                setTitle("CHYBA");
                setMessage("Server momentálne neodpovedá, skúste to prosím neskôr.");
            } else if (err.response?.status === 403) {
                setTitle("CHYBA");
                setMessage("Zlé prihlasovacie meno alebo heslo.");
            } else {
                setTitle("CHYBA");
                setMessage("Prihlasovanie zlyhalo.");
            }
            setResponseModalShow(true);
        }
    };

    return (
        <>
            <div className={"container py-5 mt-5"}>
                <div className="row d-flex justify-content-center align-items-center">
                    <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                        <div className="card">
                            <a href="#" className="exit" onClick={handleExitClick}>X</a>
                            <div className="card-body p-5 text-center">

                                <form className="mb-md-5 mt-md-4" onSubmit={handleSubmit}>
                                    <h2 className="fw-bold mb-2 text-uppercase">PRIHLÁSTE SA</h2>
                                    <p className="text-black-70 mb-5">Zadajte prosím svoje prihlasovacie meno a heslo.</p>

                                    <div className="form-outline form-white mb-4">
                                        <input type="text" className="form-control form-control-lg" placeholder="login" name="login" value={loginData.login} onChange={handleChange} />
                                    </div>

                                    <div className="form-outline form-white mb-4">
                                        <input type="password" className="form-control form-control-lg" placeholder="heslo" name="password" value={loginData.password} onChange={handleChange} />
                                    </div>

                                    <button className="btn btn-primary btn-lg px-5 form-button rounded-pill" type="submit">PRIHLÁSIŤ</button>

                                    <hr />
                                </form>

                                <div>
                                    <p className="mb-0">Ešte nemáte účet? <a href="#" className="text-blue" onClick={handleRegistrationClick}>Registrovať</a></p>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ResponseModal
                show={responseModalShow}
                handleClose={() => { setResponseModalShow(false); }}
                title={title}
                message={message}
            />
        </>
    );
}