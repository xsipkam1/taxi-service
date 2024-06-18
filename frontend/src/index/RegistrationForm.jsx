import '../styles/form.css'
import * as yup from 'yup';
import { useFormik } from 'formik';
import axios from "../security/CrossOrigin";
import { useState } from 'react';
import ResponseModal from '../common/ResponseModal';

export default function RegistrationForm({ handleLoginClick, handleExitClick }) {

    const [message, setMessage] = useState("");
    const [title, setTitle] = useState("");
    const [responseModalShow, setResponseModalShow] = useState(false);

    const validationSchema = yup.object().shape({
        login: yup.string().required("Povinné"),
        fname: yup
            .string()
            .matches(/^[A-ZČŠĎŤŽÝÁÍÉÚÄÔÖĽľčšťžýáíéúäôö]+[a-zčšťžýáíéúäôöĽľČŠĎŤŽÝÁÍÉÚÄÔÖĽľčšťžýáíéúäôöĽľ]*$/, 'Neplatné meno')
            .min(2, 'Aspoň 2 znaky')
            .max(30, 'Najviac 30 znakov')
            .required('Povinné'),
        lname: yup
            .string()
            .matches(/^[A-ZČŠĎŤŽÝÁÍÉÚÄÔÖĽľčšťžýáíéúäôö]+[a-zčšťžýáíéúäôöĽľČŠĎŤŽÝÁÍÉÚÄÔÖĽľčšťžýáíéúäôöĽľ]*$/, 'Neplatné priezvisko')
            .min(2, 'Aspoň 2 znaky')
            .max(30, 'Najviac 30 znakov')
            .required('Povinné'),
        password: yup.string().min(6, 'Heslo musí mať aspoň 6 znakov').required("Povinné"),
        confirmationPassword: yup.string().oneOf([yup.ref('password'), null], 'Heslá sa musia zhodovať').required("Povinné"),
        phoneNumber: yup.string().matches(/^[0-9]{10}$/, 'Neplatné tel.č.').required('Povinné'),
    });

    const formik = useFormik({
        initialValues: {
            login: '',
            fname: '',
            lname: '',
            password: '',
            confirmationPassword: '',
            phoneNumber: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values, { resetForm }) => {
            if (await registerUser(values)) {
                resetForm();
                setTitle("ÚSPEŠNE VYTVORENÉ");
                setMessage("Úspešne ste si vytvorili účet, teraz sa môžete prihlásiť do aplikácie pod loginom a heslom, ktoré ste si zvolili.");
                setResponseModalShow(true);
            }
        },
    });

    const registerUser = async (values) => {
        try {
            const response = await axios.post("/auth/register", values);
            return response?.data ? true : false;
        } catch (err) {
            if (!err?.response) {
                setTitle("CHYBA");
                setMessage("Server momentálne neodpovedá, skúste to prosím neskôr.");
            } else if (err.response?.status === 409) {
                setTitle("CHYBA");
                setMessage("Takéto používateľské meno už existuje, zvoľte si prosím nové.");
            } else {
                setTitle("CHYBA");
                setMessage("Registrácia zlyhala.");
            }
            setResponseModalShow(true);
            return false;
        }
    };

    return (
        <>
            <div className="container py-4">
                <div className="row d-flex justify-content-center align-items-center">
                    <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                        <div className="card">
                            <a href="#" className="exit" onClick={handleExitClick}>X</a>
                            <div className="card-body p-5 text-center">

                                <form className="mb-md-5 mt-md-1" onSubmit={formik.handleSubmit}>
                                    <h2 className="fw-bold mb-2 text-uppercase">VYTVORTE SI ÚČET</h2>
                                    <p className="text-black-70 mb-5">Zadajte prosím svoje údaje.</p>

                                    <div className="form-outline form-white mb-4">
                                        <input
                                            type="text"
                                            className={`form-control form-control-lg ${formik.touched.login && formik.errors.login ? 'is-invalid' : formik.touched.login ? 'is-valid' : ''}`}
                                            placeholder="login"
                                            name="login"
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                            value={formik.values.login}
                                        />
                                        {formik.touched.login && formik.errors.login && (
                                            <div className="invalid-feedback text-start position-absolute mt-0">{formik.errors.login}</div>
                                        )}
                                    </div>

                                    <div className="form-outline form-white mb-4">
                                        <input
                                            type="text"
                                            className={`form-control form-control-lg ${formik.touched.fname && formik.errors.fname ? 'is-invalid' : formik.touched.fname ? 'is-valid' : ''}`}
                                            placeholder="meno"
                                            name="fname"
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                            value={formik.values.fname}
                                        />
                                        {formik.touched.fname && formik.errors.fname && (
                                            <div className="invalid-feedback text-start position-absolute mt-0">{formik.errors.fname}</div>
                                        )}
                                    </div>

                                    <div className="form-outline form-white mb-4">
                                        <input
                                            type="text"
                                            className={`form-control form-control-lg ${formik.touched.lname && formik.errors.lname ? 'is-invalid' : formik.touched.lname ? 'is-valid' : ''}`}
                                            placeholder="priezvisko"
                                            name="lname"
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                            value={formik.values.lname}
                                        />
                                        {formik.touched.lname && formik.errors.lname && (
                                            <div className="invalid-feedback text-start position-absolute mt-0">{formik.errors.lname}</div>
                                        )}
                                    </div>

                                    <div className="form-outline form-white mb-4">
                                        <input
                                            type="password"
                                            className={`form-control form-control-lg ${formik.touched.password && formik.errors.password ? 'is-invalid' : formik.touched.password ? 'is-valid' : ''}`}
                                            placeholder="heslo"
                                            name="password"
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                            value={formik.values.password}
                                        />
                                        {formik.touched.password && formik.errors.password && (
                                            <div className="invalid-feedback text-start position-absolute mt-0">{formik.errors.password}</div>
                                        )}
                                    </div>

                                    <div className="form-outline form-white mb-4">
                                        <input
                                            type="password"
                                            className={`form-control form-control-lg ${formik.touched.confirmationPassword && formik.errors.confirmationPassword ? 'is-invalid' : formik.touched.confirmationPassword ? 'is-valid' : ''}`}
                                            placeholder="potvrďte heslo"
                                            name="confirmationPassword"
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                            value={formik.values.confirmationPassword}
                                        />
                                        {formik.touched.confirmationPassword && formik.errors.confirmationPassword && (
                                            <div className="invalid-feedback text-start position-absolute mt-0">{formik.errors.confirmationPassword}</div>
                                        )}
                                    </div>

                                    <div className="form-outline form-white mb-4">
                                        <input
                                            type="text"
                                            className={`form-control form-control-lg ${formik.touched.phoneNumber && formik.errors.phoneNumber ? 'is-invalid' : formik.touched.phoneNumber ? 'is-valid' : ''}`}
                                            placeholder="telefónne číslo"
                                            name="phoneNumber"
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                            value={formik.values.phoneNumber}
                                        />
                                        {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                                            <div className="invalid-feedback text-start position-absolute mt-0">{formik.errors.phoneNumber}</div>
                                        )}
                                    </div>

                                    <button className="btn btn-primary btn-lg px-5 form-button rounded-pill" type="submit">REGISTROVAŤ</button>

                                    <hr />
                                </form>

                                <div>
                                    <p className="mb-0">Už máte účet? <a href="#" className="text-blue" onClick={handleLoginClick}>Prihlásiť</a></p>
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