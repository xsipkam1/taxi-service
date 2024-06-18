import '../../styles/myprofile.css'
import '../../styles/review.css'
import '../../styles/profilemodal.css'
import Review from "../../common/Review.jsx"
import user from '../../assets/user.png';
import car from '../../assets/car.png';
import { useState, useEffect } from 'react';
import * as yup from 'yup';
import { useFormik } from 'formik';
import ConfirmDeleteModal from '../../common/ConfirmDeleteModal.jsx'
import ResponseModal from '../../common/ResponseModal.jsx'
import { useAuth } from '../../security/AuthProvider';
import axios from '../../security/CrossOrigin.jsx'
import { Image } from "cloudinary-react"
import defaultAxios from "axios"

export default function MyProfile() {
    const userToken = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
    const { logout } = useAuth();
    const [activeTab, setActiveTab] = useState('DETAILY');
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [showConfirmationModalPic, setShowConfirmationModalPic] = useState(false);
    const [responseModalShow, setResponseModalShow] = useState(false);
    const [responseModalPicShow, setResponseModalPicShow] = useState(false);
    const [errorResponseModalShow, setErrorResponseModalShow] = useState(false);
    const [errorResponseModalPicShow, setErrorResponseModalPicShow] = useState(false);
    const [isPasswordAlertVisible, setIsPasswordAlertVisible] = useState(false);
    const [details, setDetails] = useState();
    const [message, setMessage] = useState();
    const [isErrorAlertVisible, setIsErrorAlertVisible] = useState(false);
    const [imageSelected, setImageSelected] = useState();
    const [imageLoadError, setImageLoadError] = useState(false);
    const [imageUploadedSuccess, setImageUploadedSuccess] = useState(false);
    const [imageUploadedError, setImageUploadedError] = useState(false);
    const [carImageLoadError, setCarImageLoadError] = useState(false);

    const loadDetails = async () => {
        const result = await axios.get("/driver/info", { headers: { Authorization: `Bearer ${userToken}` } });
        setDetails(result.data);
    };

    const formatDate = (date) => {
        const dateTime = new Date(date);
        const day = dateTime.getDate();
        const month = dateTime.getMonth() + 1;
        const year = dateTime.getFullYear();
        return `${day}. ${month}. ${year}`;
    };

    useEffect(() => {
        loadDetails();
    }, [])

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const handleDeleteProfile = () => {
        setShowConfirmationModal(true);
    };

    const handleDeleteProfilePic = () => {
        setShowConfirmationModalPic(true);
    };

    const handleConfirmDelete = async () => {
        setShowConfirmationModal(false);
        const result = await axios.delete("/driver/delete", { headers: { Authorization: `Bearer ${userToken}` } });
        if (result?.status === 200) {
            setResponseModalShow(true);
        } else {
            setErrorResponseModalShow(true);
        }
    };

    const handleConfirmDeletePic = async () => {
        setShowConfirmationModalPic(false);
        const result = await axios.delete("/driver/delete-pic", { headers: { Authorization: `Bearer ${userToken}` } });
        if (result?.status === 200) {
            setResponseModalPicShow(true);
        } else {
            setErrorResponseModalPicShow(true);
        }
    };

    const handleCancelDelete = () => {
        setShowConfirmationModal(false);
    };

    const handleCancelDeletePic = () => {
        setShowConfirmationModalPic(false);
    };


    const validationSchema = yup.object().shape({
        password: yup.string().min(6, 'Heslo musí mať aspoň 6 znakov').required("Povinné"),
        confirmationPassword: yup.string().oneOf([yup.ref('password'), null], 'Heslá sa musia zhodovať').required("Povinné"),
    });

    const formik = useFormik({
        initialValues: {
            password: '',
            confirmationPassword: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values, { resetForm }) => {
            if (await changePassword(values)) {
                resetForm();
                setIsPasswordAlertVisible(true);
                setTimeout(() => {
                    setIsPasswordAlertVisible(false);
                }, 2000);
            }
        },
    });

    const changePassword = async (values) => {
        try {
            const response = await axios.put("/driver/change-password", values, { headers: { Authorization: `Bearer ${userToken}` } });
            return response?.status === 200 ? true : false;
        } catch (err) {
            if (!err?.response) {
                setMessage("Server neodpovedá.");
            } else if (err.response?.status === 400) {
                setMessage("Heslá sa nezhodujú.");
            } else {
                setMessage("Zmena hesla zlyhala.");
            }
            setIsErrorAlertVisible(true);
            setTimeout(() => {
                setIsErrorAlertVisible(false);
            }, 2000);
            return false;
        }
    };

    const validateFile = (event) => {
        const file = event.target.files[0];
        const fileSize = file.size / 1024 / 1024;
        const fileType = file.type;

        if (fileSize > 5) {
            event.target.value = "";
            return;
        }

        if (!["image/jpeg", "image/jpg", "image/png"].includes(fileType)) {
            event.target.value = "";
            return;
        }

        setImageSelected(event.target.files[0]);
    }

    const uploadImage = async () => {
        if (!imageSelected) return;
        const formData = new FormData();
        formData.append("file", imageSelected);
        formData.append("upload_preset", import.meta.env.VITE_CLOUD_PRESET);
        const result = await defaultAxios.post(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`, formData);
        const values = { url: `${result.data.url.split('/upload/')[0]}/upload/c_thumb,g_face,h_500,w_500/${result.data.url.split('/upload/')[1]}` };
        if (result.status !== 200) {
            setImageUploadedError(true);
            return;
        }
        setImageSelected();
        const result2 = await axios.post("/driver/upload-pic", values, { headers: { Authorization: `Bearer ${userToken}` } });
        if (result2.status !== 200) {
            setImageUploadedError(true);
            return;
        }
        setImageUploadedSuccess(true);
    }


    return (
        <section className='container-md d-flex personal-profile'>

            <div className="left-col">
                <div id="carouselExampleIndicators" className="carousel slide user-profile-pic mx-auto">
                    <div className="carousel-indicators">
                        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
                    </div>
                    <div className="carousel-inner">
                        <div className="carousel-item active">
                            {details?.profilePicUrl && !imageLoadError ? (
                                <Image
                                    cloudName={import.meta.env.VITE_CLOUD_PRESET}
                                    publicId={details?.profilePicUrl}
                                    onError={() => setImageLoadError(true)}
                                />
                            ) : (
                                <img src={user} alt="user profile pic" />
                            )}
                        </div>
                        <div className="carousel-item">
                            {details?.carPictureUrl && !carImageLoadError ? (
                                <Image
                                    cloudName={import.meta.env.VITE_CLOUD_PRESET}
                                    publicId={details?.carPictureUrl}
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
                <div className="settings d-flex flex-column">
                    <a href="#" className={activeTab === 'DETAILY' ? 'active' : ''} onClick={() => handleTabClick('DETAILY')}><i className="bi bi-person-circle"></i> DETAILY</a>
                    <a href="#" className={activeTab === 'NASTAVENIA' ? 'active' : ''} onClick={() => handleTabClick('NASTAVENIA')}><i className="bi bi-gear-fill"></i> NASTAVENIA</a>
                    <a href="#" className={activeTab === 'RECENZIE' ? 'active' : ''} onClick={() => handleTabClick('RECENZIE')}><i className="bi bi-chat-left-text-fill"></i> RECENZIE</a>
                    <a href="#" onClick={logout}><i className="bi bi-door-open-fill"></i> ODHLÁSIŤ SA</a>
                </div>
            </div>

            {activeTab == "DETAILY" &&
                <div className="right-col">
                    <h2>{details?.fname.toUpperCase()} {details?.lname.toUpperCase()}</h2><hr />
                    <div className="personal-details">
                        <div className="detail-line">
                            <span className="label">Login:</span>
                            <span className="value">{details?.login}</span>
                        </div>
                        <div className="detail-line">
                            <span className="label">Vozidlo:</span>
                            <span className="value">{details?.carName}</span>
                        </div>
                        <div className="detail-line">
                            <span className="label">Cena/km:</span>
                            <span className="value">{details?.cost}€</span>
                        </div>
                        <div className="detail-line">
                            <span className="label">Hodnotenie:</span>
                            <span className="value">{details?.ranking !== 0 ? `${details?.ranking}/5` : "-/5"}</span>
                        </div>
                        <div className="detail-line">
                            <span className="label">Počet hodnotení:</span>
                            <span className="value">{details?.reviews.length}</span>
                        </div>
                        <div className="detail-line">
                            <span className="label">Počet žiadostí o jazdu:</span>
                            <span className="value">{details?.pendingAmount}</span>
                        </div>
                        <div className="detail-line">
                            <span className="label">Počet odjazdených jázd:</span>
                            <span className="value">{details?.completedAmount}</span>
                        </div>
                        <div className="detail-line">
                            <span className="label">Počet zamietnutých/neprijatých jázd:</span>
                            <span className="value">{details?.deniedAmount}</span>
                        </div>
                        <div className="detail-line">
                            <span className="label">Dátum registrácie:</span>
                            <span className="value">{formatDate(details?.hireDate)}</span>
                        </div>
                    </div>
                </div>
            }

            {activeTab == "NASTAVENIA" &&
                <div className="right-col">
                    <h2>NASTAVENIA</h2><hr />
                    <div className="accordion">

                        <div className="accordion-item">
                            <h2 className="accordion-header" id="panelsStayOpen-headingOne">
                                <button className="accordion-button collapsed label" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="false" aria-controls="panelsStayOpen-collapseOne">
                                    ZMENIŤ PROFILOVÚ FOTKU
                                </button>
                            </h2>
                            <div id="panelsStayOpen-collapseOne" className="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingOne">
                                <div className="accordion-body bg-light">
                                    <label htmlFor="formFile" className="form-label">Nahrajte súbor - MAX veľkost 5MB, podporované formáty (jpg,png,jpeg)</label>
                                    <input className="form-control border-dark m-0" type="file" id="formFile" accept=".jpg,.jpeg,.png" onChange={validateFile} />
                                    <button type="button" className="btn btn-outline-primary m-0 mt-4 rounded-pill" onClick={uploadImage}>NAHRAŤ PROFILOVÚ FOTKU</button>
                                </div>
                            </div>
                        </div>

                        <div className="accordion-item">
                            <h2 className="accordion-header" id="panelsStayOpen-headingTwo">
                                <button className="accordion-button collapsed label" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseTwo" aria-expanded="false" aria-controls="panelsStayOpen-collapseTwo">
                                    VYMAZAŤ PROFILOVÚ FOTKU
                                </button>
                            </h2>
                            <div id="panelsStayOpen-collapseTwo" className="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingTwo">
                                <div className="accordion-body bg-light">
                                    Pokiaľ nemáte zálohovanú profilovú fotku, po jej vymazaní sa stratí <strong>bez možnosti obnovenia</strong>. <br />
                                    <button type="button" className="btn btn-outline-danger m-0 mt-4 rounded-pill" onClick={handleDeleteProfilePic}>VYMAZAŤ PROFILOVÚ FOTKU</button>
                                </div>
                            </div>
                        </div>

                        <div className="accordion-item">
                            <h2 className="accordion-header" id="panelsStayOpen-headingThree">
                                <button className="accordion-button collapsed label" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseThree" aria-expanded="false" aria-controls="panelsStayOpen-collapseThree">
                                    ZMENIŤ HESLO
                                </button>
                            </h2>
                            <div id="panelsStayOpen-collapseThree" className="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingThree">
                                <div className="accordion-body bg-light">
                                    Špecifikujte nové heslo do políčka nižšie. Následne potvrďte heslo. Heslá sa musia zhodovať a mať aspoň 6 znakov.
                                    <div className="form-outline form-white mb-4 mt-3">
                                        <input
                                            type="password"
                                            className={`form-control m-0 ${formik.touched.password && formik.errors.password ? 'is-invalid' : formik.touched.password ? 'is-valid' : ''}`}
                                            placeholder="zadajte nové heslo"
                                            name="password"
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                            value={formik.values.password}
                                        />
                                        {formik.touched.password && formik.errors.password && (
                                            <div className="invalid-feedback text-start mt-0 fs-6">{formik.errors.password}</div>
                                        )}
                                    </div>
                                    <div className="form-outline form-white mb-4">
                                        <input
                                            type="password"
                                            className={`form-control m-0 ${formik.touched.confirmationPassword && formik.errors.confirmationPassword ? 'is-invalid' : formik.touched.confirmationPassword ? 'is-valid' : ''}`}
                                            placeholder="potvrďte heslo"
                                            name="confirmationPassword"
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                            value={formik.values.confirmationPassword}
                                        />
                                        {formik.touched.confirmationPassword && formik.errors.confirmationPassword && (
                                            <div className="invalid-feedback text-start mt-0 fs-6">{formik.errors.confirmationPassword}</div>
                                        )}
                                    </div>
                                    <div className='d-flex flex-sm-row flex-column align-items-center justify-content-between'>
                                        <button type="button" className="btn btn-outline-primary mb-2 rounded-pill" onClick={() => { formik.handleSubmit(); }}>ZMENIŤ HESLO</button>
                                        <div className={`alert alert-success d-flex align-items-center mb-0 ${isPasswordAlertVisible ? 'visible' : 'invisible'}`} role="alert">
                                            <span><i className="bi bi-check-circle-fill me-2"></i>Úspešne zmenené.</span>
                                        </div>
                                        <div className={`alert alert-danger d-flex align-items-center mb-0 ${isErrorAlertVisible ? 'visible' : 'invisible'}`} role="alert">
                                            <span><i className="bi bi-exclamation-triangle-fill me-2"></i>{message}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="accordion-item">
                            <h2 className="accordion-header" id="panelsStayOpen-headingFour">
                                <button className="accordion-button collapsed label" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseFour" aria-expanded="false" aria-controls="panelsStayOpen-headingFour">
                                    VYMAZAŤ PROFIL
                                </button>
                            </h2>
                            <div id="panelsStayOpen-collapseFour" className="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingFour">
                                <div className="accordion-body bg-light">
                                    Po vymazaní svojho profilu stratíte všetky Vaše údaje a prístup do našej webovej aplikacie <strong>bez možnosti obnovenia</strong>. Pre opätovný prístup sa bude vyžadovať vytvorenie nového profilu. Naozaj chcete vymazať svoj profil? <br />
                                    <button type="button" className="btn btn-outline-danger m-0 mt-4 rounded-pill" onClick={handleDeleteProfile}>VYMAZAŤ PROFIL</button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            }

            {activeTab == "RECENZIE" &&
                <div className='right-col'>
                    <h2>RECENZIE</h2> <hr />
                    {details?.reviews.some(review => review.plus.trim() !== '' || review.minus.trim() !== '') && (
                        <>
                            {details?.reviews.map((review) => (
                                (review.plus.trim() !== '' || review.minus.trim() !== '') && (
                                    <Review
                                        key={review.id}
                                        review={review}
                                    />
                                )
                            ))}
                        </>
                    )}
                </div>
            }

            <ConfirmDeleteModal
                show={showConfirmationModal}
                handleClose={handleCancelDelete}
                handleConfirm={handleConfirmDelete}
                message={`Naozaj chcete vymazať svoj profil?`}
            />

            <ResponseModal
                show={responseModalShow}
                handleClose={() => { setResponseModalShow(false); window.location.href = '/'; }}
                title="ÚSPEŠNE VYMAZANÉ"
                message={`Úspešne ste vymazali svoj profil. Teraz budete presmerovaný na domovskú stránku, kde si prípadne môžete vytvoriť nový profil.`}
            />

            <ResponseModal
                show={errorResponseModalShow}
                handleClose={() => { setErrorResponseModalShow(false); }}
                title="CHYBA"
                message={`Pri vymazávaní Vášho profilu nastala chyba.`}
            />

            <ConfirmDeleteModal
                show={showConfirmationModalPic}
                handleClose={handleCancelDeletePic}
                handleConfirm={handleConfirmDeletePic}
                message={`Naozaj chcete vymazať svoju profilovú fotku?`}
            />

            <ResponseModal
                show={responseModalPicShow}
                handleClose={() => { setResponseModalPicShow(false); window.location.href = '/driver/myprofile'; }}
                title="ÚSPEŠNE VYMAZANÉ"
                message={`Úspešne ste vymazali svoju profilovú fotku.`}
            />

            <ResponseModal
                show={errorResponseModalPicShow}
                handleClose={() => { setErrorResponseModalPicShow(false); }}
                title="CHYBA"
                message={`Pri vymazávaní Vášej profilovej fotky nastala chyba.`}
            />

            <ResponseModal
                show={imageUploadedError}
                handleClose={() => { setImageUploadedError(false); }}
                title="CHYBA"
                message={`Pri nahrávaní Vašej profilovej fotky nastala chyba.`}
            />

            <ResponseModal
                show={imageUploadedSuccess}
                handleClose={() => { setImageUploadedSuccess(false); window.location.href = '/driver/myprofile'; }}
                title="ÚSPEŠNE ZMENENÉ"
                message={`Úspešne ste zmenili svoju profilovú fotku.`}
            />

        </section>
    );
}