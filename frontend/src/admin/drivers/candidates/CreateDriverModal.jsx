import { Modal, Button } from 'react-bootstrap';
import '../../../styles/profilemodal.css';
import '../../../styles/myprofile.css';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useState, useEffect } from 'react';
import axios from '../../../security/CrossOrigin.jsx'
import ResponseModal from '../../../common/ResponseModal.jsx';
import UploadCarPictureModal from '../../common/UploadCarPictureModal.jsx';

export default function CreateDriverModal({ show, handleClose, candidate, reloadCandidates }) {
    const userToken = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
    const [responseModalShow, setResponseModalShow] = useState(false);
    const [errorResponseModalShow, setErrorResponseModalShow] = useState(false);
    const [uploadCarPictureModalShow, setUploadCarPictureModalShow] = useState(false);
    const [message, setMessage] = useState("");
    const [title, setTitle] = useState("");
    const [newCar, setNewCar] = useState({});
    const [pictureUploaded, setPictureUploaded] = useState(false);
    const [imageUploadedError, setImageUploadedError] = useState(false);

    const validationSchema = yup.object().shape({
        login: yup.string().required("Povinné"),
        password: yup.string().min(6, 'Heslo musí mať aspoň 6 znakov').required("Povinné"),
        confirmationPassword: yup.string().oneOf([yup.ref('password'), null], 'Heslá sa musia zhodovať').required("Povinné"),
        carName: yup.string().required("Povinné"),
        carPassengers: yup.string().matches(/^[1-9]\d*$/, 'Zlý formát').required("Povinné"),
        cost: yup.string().matches(/^(0|[0-9]\d*(\.\d{1,2})?)$/, 'Neplatná cena').required("Povinné"),
    });

    const formik = useFormik({
        initialValues: {
            fname: candidate.fname,
            lname: candidate.lname,
            telephone: candidate.telephone,
            login: '',
            password: '',
            confirmationPassword: '',
            carName: '',
            carPassengers: '',
            carPictureUrl: '',
            cost: ''
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            setNewCar({
                carName: values.carName,
                carPassengers: values.carPassengers,
            });

            if (await checkIfCarExists(values.carName, values.carPassengers)) {                                  //netreba nahravat fotku
                if (await registerDriver(values)) {
                    handleClose();
                    await axios.delete(`/admin/reject-candidate/${candidate.id}`, { headers: { Authorization: `Bearer ${userToken}` } });
                    setResponseModalShow(true);
                }
            } else {                                                                                             //treba nahrat fotku
                handleClose();
                setUploadCarPictureModalShow(true);

            }

            {/*ak nastala chyba*/ }
            {/*setErrorResponseModalShow(true);*/ }
        },
    });

    const handleCreateDriverAfterPictureUploaded = async () => {
        setUploadCarPictureModalShow(false);
        const values = formik.values;
        if (await registerDriver(values)) {
            await axios.delete(`/admin/reject-candidate/${candidate.id}`, { headers: { Authorization: `Bearer ${userToken}` } });
            setResponseModalShow(true);
        }
    }

    useEffect(() => {
        if (pictureUploaded) {
            handleCreateDriverAfterPictureUploaded();
        }
    }, [pictureUploaded]);

    const checkIfCarExists = async (name, passengers) => {
        try {
            const response = await axios.post("/admin/car-exists", {
                name,
                passengers
            }, {
                headers: {
                    Authorization: `Bearer ${userToken}`
                }
            });
            return response?.status === 200 ? true : false;
        } catch (err) { }
    }

    const registerDriver = async (values) => {
        try {
            const response = await axios.post("/admin/create-driver", values, { headers: { Authorization: `Bearer ${userToken}` } });
            return response?.status === 200 ? true : false;
        } catch (err) {
            if (!err?.response) {
                setTitle("CHYBA");
                setMessage("Server momentálne neodpovedá, skúste to prosím neskôr.");
            } else if (err.response?.status === 409) {
                setTitle("CHYBA");
                setMessage("Takéto používateľské meno už existuje, zvoľte prosím nové.");
            } else {
                setTitle("CHYBA");
                setMessage(`Pri vytváraní profilu pre kandidáta ${candidate.fname} ${candidate.lname} nastala chyba.`);
            }
            handleClose();
            setUploadCarPictureModalShow(false);
            setErrorResponseModalShow(true);
            return false;
        }
    };

    const handlePictureUploaded = (url) => {
        formik.setFieldValue('carPictureUrl', url);
        setPictureUploaded(true);
    };

    return (
        <>
            <Modal show={show} onHide={handleClose} centered className='modal-lg'>
                <Modal.Header className='text-center' closeButton>
                    <Modal.Title className="fs-1 w-100">VYTVORTE PROFIL</Modal.Title>
                </Modal.Header>
                <Modal.Body className="fs-5">
                    <form>
                        <div className="row">
                            <div className="col">
                                <input type="text" className="form-control bg-light" value={candidate.fname} readOnly />
                            </div>
                            <div className="col">
                                <input type="text" className="form-control bg-light" value={candidate.lname} readOnly />
                            </div>
                        </div>
                        <input className="form-control mt-3 bg-light" type="text" value={candidate.telephone} readOnly />

                        <div className='mt-4 shadow-sm'>
                            <input
                                type="text"
                                className={`form-control ${formik.touched.login && formik.errors.login ? 'is-invalid' : formik.touched.login ? 'is-valid' : ''}`}
                                placeholder="login"
                                name="login"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.login}
                            />
                            {formik.touched.login && formik.errors.login && (
                                <div className="invalid-feedback text-start position-absolute mt-0 fs-6">{formik.errors.login}</div>
                            )}
                        </div>

                        <div className='mt-4 shadow-sm'>
                            <input
                                type="password"
                                className={`form-control ${formik.touched.password && formik.errors.password ? 'is-invalid' : formik.touched.password ? 'is-valid' : ''}`}
                                placeholder="heslo"
                                name="password"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.password}
                            />
                            {formik.touched.password && formik.errors.password && (
                                <div className="invalid-feedback text-start position-absolute mt-0 fs-6">{formik.errors.password}</div>
                            )}
                        </div>

                        <div className='mt-4 shadow-sm'>
                            <input
                                type="password"
                                className={`form-control ${formik.touched.confirmationPassword && formik.errors.confirmationPassword ? 'is-invalid' : formik.touched.confirmationPassword ? 'is-valid' : ''}`}
                                placeholder="potvrďte heslo"
                                name="confirmationPassword"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.confirmationPassword}
                            />
                            {formik.touched.confirmationPassword && formik.errors.confirmationPassword && (
                                <div className="invalid-feedback text-start position-absolute mt-0 fs-6">{formik.errors.confirmationPassword}</div>
                            )}
                        </div>

                        <div className="row mt-4">
                            <div className="col">
                                <input
                                    type="text"
                                    className={`form-control shadow-sm ${formik.touched.carName && formik.errors.carName ? 'is-invalid' : formik.touched.carName ? 'is-valid' : ''}`}
                                    placeholder="vozidlo"
                                    name="carName"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    value={formik.values.carName}
                                />
                                {formik.touched.carName && formik.errors.carName && (
                                    <div className="invalid-feedback text-start position-absolute mt-0 fs-6">{formik.errors.carName}</div>
                                )}
                            </div>
                            <div className="col">
                                <input
                                    type="number"
                                    className={`form-control shadow-sm ${formik.touched.carPassengers && formik.errors.carPassengers ? 'is-invalid' : formik.touched.carPassengers ? 'is-valid' : ''}`}
                                    placeholder='miesta pre pasažierov'
                                    name="carPassengers"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    value={formik.values.carPassengers}
                                />
                                {formik.touched.carPassengers && formik.errors.carPassengers && (
                                    <div className="invalid-feedback text-start position-absolute mt-0 fs-6">{formik.errors.carPassengers}</div>
                                )}
                            </div>
                        </div>

                        <div>
                            <input
                                type="number"
                                className={`form-control mt-4 shadow-sm ${formik.touched.cost && formik.errors.cost ? 'is-invalid' : formik.touched.cost ? 'is-valid' : ''}`}
                                placeholder='cena/km'
                                step="0.01"
                                min="0"
                                name="cost"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.cost}
                            />
                            {formik.touched.cost && formik.errors.cost && (
                                <div className="invalid-feedback text-start position-absolute mt-0 fs-6">{formik.errors.cost}</div>
                            )}
                        </div>

                    </form>
                </Modal.Body>
                <Modal.Footer className="mt-2 justify-content-center">
                    <Button className='fs-5 rounded-pill' variant="primary" onClick={() => { formik.handleSubmit(); }}>
                        VYTVORIŤ
                    </Button>
                    <Button className='fs-5 rounded-pill' variant="outline-primary" onClick={handleClose}>
                        ZATVORIŤ
                    </Button>
                </Modal.Footer>
            </Modal>

            <ResponseModal
                show={responseModalShow}
                handleClose={() => { setResponseModalShow(false); reloadCandidates(); }}
                title="ÚSPEŠNE VYTVORENÉ"
                message={`Úspešne ste vytvorili profil pre vodiča ${candidate.fname} ${candidate.lname}.`}
            />

            <ResponseModal
                show={errorResponseModalShow}
                handleClose={() => { setErrorResponseModalShow(false); }}
                title={title}
                message={message}
            />

            <UploadCarPictureModal
                show={uploadCarPictureModalShow}
                handleClose={() => { setUploadCarPictureModalShow(false); }}
                car={newCar}
                onError={() => { setUploadCarPictureModalShow(false); setImageUploadedError(true); }}
                pictureUploaded={handlePictureUploaded}
            />

            <ResponseModal
                show={imageUploadedError}
                handleClose={() => { setImageUploadedError(false); }}
                title="CHYBA"
                message={`Pri nahrávaní fotky auta nastala chyba.`}
            />

        </>
    );
}
