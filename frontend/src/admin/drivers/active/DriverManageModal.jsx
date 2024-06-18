import { Modal, Button } from 'react-bootstrap';
import user from '../../../assets/user.png';
import car from '../../../assets/car.png';
import '../../../styles/profilemodal.css';
import '../../../styles/myprofile.css';
import Review from "./ManageReview.jsx"
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useState, useEffect } from 'react';
import ResponseModal from '../../../common/ResponseModal.jsx';
import ConfirmDeleteModal from '../../../common/ConfirmDeleteModal.jsx';
import UploadCarPictureModal from '../../common/UploadCarPictureModal.jsx';
import axios from '../../../security/CrossOrigin.jsx'
import { Image } from "cloudinary-react"

export default function DriverManageModal({ show, handleClose, driver, reloadDrivers }) {
    const userToken = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
    const [isCarAlertVisible, setIsCarAlertVisible] = useState(false);
    const [isCostAlertVisible, setIsCostAlertVisible] = useState(false);
    const [responseModalShow, setResponseModalShow] = useState(false);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [errorResponseModalShow, setErrorResponseModalShow] = useState(false);
    const [uploadCarPictureModalShow, setUploadCarPictureModalShow] = useState(false);
    const [newCar, setNewCar] = useState({});
    const [isCostErrorAlertVisible, setIsCostErrorAlertVisible] = useState(false);
    const [pictureUploaded, setPictureUploaded] = useState(false);
    const [changeCarResponseModalShow, setChangeCarResponseModalShow] = useState(false);
    const [isCarErrorAlertVisible, setIsCarErrorAlertVisible] = useState(false);
    const [imageLoadError, setImageLoadError] = useState(false);
    const [imageUploadedError, setImageUploadedError] = useState(false);
    const [carImageLoadError, setCarImageLoadError] = useState(false);

    const changeCarValidationSchema = yup.object().shape({
        carName: yup.string().required("Povinné"),
        carPassengers: yup.string().matches(/^[1-9]\d*$/, 'Zlý formát').required("Povinné"),
    });

    const changeCostValidationSchema = yup.object().shape({
        cost: yup.string().matches(/^(0|[0-9]\d*(\.\d{1,2})?)$/, 'Neplatná cena').required("Povinné"),
    });

    const changeCarFormik = useFormik({
        initialValues: {
            carName: '',
            carPassengers: '',
            carPictureUrl: ''
        },
        validationSchema: changeCarValidationSchema,
        onSubmit: async (values, { resetForm }) => {
            setNewCar(values);

            if (await checkIfCarExists(values.carName, values.carPassengers)) {
                const result = await axios.put(`/admin/update-car/${driver.id}`, values, { headers: { Authorization: `Bearer ${userToken}` } });
                if (result?.status === 200) {
                    setIsCarAlertVisible(true);
                    resetForm();
                    setTimeout(() => {
                        setIsCarAlertVisible(false);
                        reloadDrivers();
                    }, 2000);
                } else {
                    setIsCarErrorAlertVisible(true);
                    setTimeout(() => {
                        setIsCarErrorAlertVisible(false);
                    }, 2000);
                }
            } else {
                handleClose();
                setUploadCarPictureModalShow(true);
            }
        },
    });

    useEffect(() => {
        if (pictureUploaded) {
            setPictureUploaded(false);
            handleUpdateCarPictureUploaded();
        }
    }, [pictureUploaded]);

    const handleUpdateCarPictureUploaded = async () => {
        setUploadCarPictureModalShow(false);
        const values = changeCarFormik.values;
        const result = await axios.put(`/admin/update-car/${driver.id}`, values, { headers: { Authorization: `Bearer ${userToken}` } });
        if (result?.status === 200) {
            setChangeCarResponseModalShow(true);
        }
    }

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

    const changeCostFormik = useFormik({
        initialValues: {
            cost: ''
        },
        validationSchema: changeCostValidationSchema,
        onSubmit: async (values, { resetForm }) => {
            if (await changeCost(values)) {
                resetForm();
                setIsCostAlertVisible(true);
                setTimeout(() => {
                    setIsCostAlertVisible(false);
                    reloadDrivers();
                }, 2000);
            }
        },
    });

    const changeCost = async (values) => {
        try {
            const response = await axios.put(`/admin/update-cost/${driver.id}`, values, { headers: { Authorization: `Bearer ${userToken}` } });
            return response?.status === 200 ? true : false;
        } catch (err) {
            setIsCostErrorAlertVisible(true);
            setTimeout(() => {
                setIsCostErrorAlertVisible(false);
            }, 2000);
            return false;
        }
    };

    const handleConfirmDelete = async () => {
        setShowConfirmationModal(false);

        const result = await axios.delete(`/admin/delete-driver/${driver.id}`, { headers: { Authorization: `Bearer ${userToken}` } });
        if (result?.status === 200) {
            setResponseModalShow(true);
        } else {
            setErrorResponseModalShow(true);
        }
    };

    const handleCancelDelete = () => {
        setShowConfirmationModal(false);
    };

    const handleDeleteProfile = () => {
        handleClose();
        setShowConfirmationModal(true);
    };

    const formatDate = (date) => {
        const dateTime = new Date(date);
        const day = dateTime.getDate();
        const month = dateTime.getMonth() + 1;
        const year = dateTime.getFullYear();
        return `${day}. ${month}. ${year}`;
    };

    const handlePictureUploaded = (url) => {
        changeCarFormik.setFieldValue('carPictureUrl', url);
        setPictureUploaded(true);
    };

    return (
        <>
            <Modal show={show} onHide={handleClose} centered scrollable className='modal-xl'>
                <Modal.Header className='text-center' closeButton>
                    <Modal.Title className="fs-1 w-100">{`${driver.fname} ${driver.lname}`}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="fs-5">
                    <div className="profile-details-modal d-flex">
                        <div className="left-col">
                            <div id="carouselExampleIndicators" className="carousel slide user-profile-pic mx-auto">
                                <div className="carousel-indicators">
                                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
                                </div>
                                <div className="carousel-inner">
                                    <div className="carousel-item active">
                                        {driver.profilePicUrl && !imageLoadError ? (
                                            <Image
                                                cloudName={import.meta.env.VITE_CLOUD_PRESET}
                                                publicId={driver.profilePicUrl}
                                                onError={() => setImageLoadError(true)}
                                                className='d-block w-100'
                                            />
                                        ) : (
                                            <img src={user} className='d-block w-100' alt="user profile pic" />
                                        )}
                                    </div>
                                    <div className="carousel-item">
                                        {driver.carPictureUrl && !carImageLoadError ? (
                                            <Image
                                                cloudName={import.meta.env.VITE_CLOUD_PRESET}
                                                publicId={driver.carPictureUrl}
                                                onError={() => setCarImageLoadError(true)}
                                                className='d-block w-100'
                                            />
                                        ) : (
                                            <img src={car} className="d-block w-100" alt="car pic" />
                                        )}
                                    </div>
                                </div>
                                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                    <span className="visually-hidden">Previous</span>
                                </button>
                                <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                    <span className="visually-hidden">Next</span>
                                </button>
                            </div>
                        </div>
                        <div className="right-col w-100 align-self-center">
                            <div className='d-flex justify-content-between driver-details lh-lg'>
                                <div className='driver-details-left'>
                                    <div className="detail-line mb-0">
                                        <span className="label">Cena/km:</span>
                                        <span className="value"><strong>{`${driver.cost}€`}</strong></span>
                                    </div>
                                    <div className="detail-line mb-0">
                                        <span className="label">Vozidlo:</span>
                                        <span className="value"><strong>{`${driver.carName}`}</strong></span>
                                    </div>
                                    <div className="detail-line mb-0">
                                        <span className="label">Počet jázd:</span>
                                        <span className="value"><strong>{`${driver.ridesCompleted}`}</strong></span>
                                    </div>
                                    <div className="detail-line mb-0">
                                        <span className="label">Dátum najatia:</span>
                                        <span className="value"><strong>{`${formatDate(driver.hireDate)}`}</strong></span>
                                    </div>
                                    <div className="detail-line mb-0">
                                        <span className="label">Hodnotenie:</span>
                                        <span className="value"><strong>{driver.ranking !== 0 ? `${driver.ranking}/5` : "-/5"}</strong></span>
                                    </div>
                                    <div className="detail-line mb-0">
                                        <span className="label">Počet hodnotení:</span>
                                        <span className="value"><strong>{`${driver.reviews.length}`}</strong></span>
                                    </div>
                                    <div className="detail-line mb-0">
                                        <span className="label">Tel.č.:</span>
                                        <span className="value"><strong>{`${driver.telephone}`}</strong></span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="accordion">

                        <div className="accordion-item">
                            <h2 className="accordion-header" id="panelsStayOpen-headingOne">
                                <button className="accordion-button collapsed label" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="false" aria-controls="panelsStayOpen-collapseOne">
                                    <i className="bi bi-car-front me-3"></i>ZMENIŤ VOZIDLO
                                </button>
                            </h2>
                            <div id="panelsStayOpen-collapseOne" className="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingOne">
                                <div className="accordion-body bg-light">
                                    {`Aktuálne vozidlo vodiča je `}
                                    <strong>{`${driver.carName}`}</strong>
                                    {` ${driver.carPassengers === 1 ? 's' : 'so'} `}
                                    <strong>{`${driver.carPassengers}`}</strong>
                                    {` miest${driver.carPassengers === 1 ? 'om' : 'ami'} na sedenie. Ak chcete vozidlo zmeniť, zadajte názov vozidla do políčka nižšie a špecifikujte počet miest pre pasažierov v danom vozidle.`}
                                    <br />
                                    <div className='mb-4'>
                                        <input
                                            type="text"
                                            className={`form-control mt-3 ${changeCarFormik.touched.carName && changeCarFormik.errors.carName ? 'is-invalid' : changeCarFormik.touched.carName ? 'is-valid' : ''}`}
                                            placeholder='názov vozidla'
                                            name="carName"
                                            onBlur={changeCarFormik.handleBlur}
                                            onChange={changeCarFormik.handleChange}
                                            value={changeCarFormik.values.carName}
                                        />
                                        {changeCarFormik.touched.carName && changeCarFormik.errors.carName && (
                                            <div className="invalid-feedback text-start mt-0 fs-6">{changeCarFormik.errors.carName}</div>
                                        )}
                                    </div>
                                    <div className='mb-4'>
                                        <input
                                            type="number"
                                            className={`form-control mt-3 ${changeCarFormik.touched.carPassengers && changeCarFormik.errors.carPassengers ? 'is-invalid' : changeCarFormik.touched.carPassengers ? 'is-valid' : ''}`}
                                            placeholder='počet miest pre pasažierov'
                                            min="0"
                                            name="carPassengers"
                                            onBlur={changeCarFormik.handleBlur}
                                            onChange={changeCarFormik.handleChange}
                                            value={changeCarFormik.values.carPassengers}
                                        />
                                        {changeCarFormik.touched.carPassengers && changeCarFormik.errors.carPassengers && (
                                            <div className="invalid-feedback text-start mt-0 fs-6">{changeCarFormik.errors.carPassengers}</div>
                                        )}
                                    </div>
                                    <div className='d-flex flex-sm-row flex-column align-items-center justify-content-between'>
                                        <button type="button" className="btn btn-outline-primary mb-2 rounded-pill" onClick={() => { changeCarFormik.handleSubmit(); }}>ZMENIŤ VOZIDLO</button>
                                        <div className={`alert alert-success d-flex align-items-center mb-0 ${isCarAlertVisible ? 'visible' : 'invisible'}`} role="alert">
                                            <span><i className="bi bi-check-circle-fill me-2"></i>Úspešne zmenené.</span>
                                        </div>
                                        <div className={`alert alert-danger d-flex align-items-center mb-0 ${isCarErrorAlertVisible ? 'visible' : 'invisible'}`} role="alert">
                                            <span><i className="bi bi-exclamation-triangle-fill me-2"></i>Chyba.</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="accordion-item">
                            <h2 className="accordion-header" id="panelsStayOpen-headingTwo">
                                <button className="accordion-button collapsed label" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseTwo" aria-expanded="false" aria-controls="panelsStayOpen-collapseTwo">
                                    <i className="bi bi-cash-coin me-3"></i>ZMENIŤ CENU
                                </button>
                            </h2>
                            <div id="panelsStayOpen-collapseTwo" className="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingTwo">
                                <div className="accordion-body bg-light">
                                    {`Aktuálna`} <strong>cena/km</strong> {`je nastavená na`} <strong>{driver.cost}€</strong>. {`Ak chcete cenu zmeniť, zadajte novú cenu do políčka nižšie.`} <br />
                                    <div className="mb-4">
                                        <input
                                            type="number"
                                            className={`form-control mt-3 shadow-sm ${changeCostFormik.touched.cost && changeCostFormik.errors.cost ? 'is-invalid' : changeCostFormik.touched.cost ? 'is-valid' : ''}`}
                                            placeholder='cena/km'
                                            step="0.01"
                                            min="0"
                                            name="cost"
                                            onBlur={changeCostFormik.handleBlur}
                                            onChange={changeCostFormik.handleChange}
                                            value={changeCostFormik.values.cost}
                                        />
                                        {changeCostFormik.touched.cost && changeCostFormik.errors.cost && (
                                            <div className="invalid-feedback text-start mt-0 fs-6">{changeCostFormik.errors.cost}</div>
                                        )}
                                    </div>
                                    <div className='d-flex flex-sm-row flex-column align-items-center justify-content-between'>
                                        <button type="button" className="btn btn-outline-primary mb-2 rounded-pill" onClick={() => { changeCostFormik.handleSubmit(); }}>ZMENIŤ CENU</button>
                                        <div className={`alert alert-success d-flex align-items-center mb-0 ${isCostAlertVisible ? 'visible' : 'invisible'}`} role="alert">
                                            <span><i className="bi bi-check-circle-fill me-2"></i>Úspešne zmenené.</span>
                                        </div>
                                        <div className={`alert alert-danger d-flex align-items-center mb-0 ${isCostErrorAlertVisible ? 'visible' : 'invisible'}`} role="alert">
                                            <span><i className="bi bi-exclamation-triangle-fill me-2"></i>Chyba.</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="accordion-item">
                            <h2 className="accordion-header" id="panelsStayOpen-headingFour">
                                <button className="accordion-button collapsed label" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseFour" aria-expanded="false" aria-controls="panelsStayOpen-headingFour">
                                    <i className="bi bi-person-dash me-3"></i>VYMAZAŤ PROFIL
                                </button>
                            </h2>
                            <div id="panelsStayOpen-collapseFour" className="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingFour">
                                <div className="accordion-body bg-light ">
                                    Po vymazaní profilu vodiča sa stratia všetky údaje a prístup vodiča do našej webovej aplikacie <strong>bez možnosti obnovenia</strong>. Pre opätovný prístup sa bude vyžadovať vytvorenie nového profilu. Naozaj chcete vymazať profil? <br />
                                    <div className='d-flex flex-sm-row flex-column align-items-center justify-content-between'>
                                        <button type="button" className="btn btn-outline-danger m-0 mt-4 rounded-pill" onClick={handleDeleteProfile}>VYMAZAŤ PROFIL</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {driver.reviews.some(review => review.plus.trim() !== '' || review.minus.trim() !== '') && (
                        <>
                            <h2 className='mt-5'>RECENZIE:</h2>
                            {driver.reviews.map((review) => (
                                (review.plus.trim() !== '' || review.minus.trim() !== '') && (
                                    <Review
                                        key={review.id}
                                        review={review}
                                        reload={reloadDrivers}
                                    />
                                )
                            ))}
                        </>
                    )}

                </Modal.Body>
                <Modal.Footer className="justify-content-center">
                    <Button className='fs-5' variant="outline-primary rounded-pill" onClick={handleClose}>
                        ZATVORIŤ
                    </Button>
                </Modal.Footer>
            </Modal>

            <ResponseModal
                show={responseModalShow}
                handleClose={() => { setResponseModalShow(false); reloadDrivers(); }}
                title="ÚSPEŠNE VYMAZANÉ"
                message={`Úspešne ste vymazali profil vodiča ${driver.fname} ${driver.lname}.`}
            />

            <ResponseModal
                show={errorResponseModalShow}
                handleClose={() => { setErrorResponseModalShow(false); }}
                title="CHYBA"
                message={`Pri vymazávaní profilu vodiča ${driver.fname} ${driver.lname} nastala chyba.`}
            />

            <ResponseModal
                show={changeCarResponseModalShow}
                handleClose={() => { setChangeCarResponseModalShow(false); reloadDrivers(); }}
                title="ÚSPEŠNE ZMENENÉ"
                message={`Úspešne ste zmenili vozidlo vodiča ${driver.fname} ${driver.lname}.`}
            />

            <ConfirmDeleteModal
                show={showConfirmationModal}
                handleClose={handleCancelDelete}
                handleConfirm={handleConfirmDelete}
                message={`Po vymazaní profilu vodiča ${driver.fname} ${driver.lname} sa stratia všetky údaje a prístup vodiča do našej webovej aplikacie bez možnosti obnovenia. Pre opätovný prístup sa bude vyžadovať vytvorenie nového profilu. Naozaj chcete vymazať profil?`}
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
