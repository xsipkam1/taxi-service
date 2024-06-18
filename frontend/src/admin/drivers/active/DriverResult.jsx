import user from '../../../assets/user.png';
import '../../../styles/result.css';
import { useState } from 'react';
import axios from '../../../security/CrossOrigin'
import DriverManageModal from './DriverManageModal';
import ConfirmDeleteUserModal from '../../../common/ConfirmDeleteModal';
import ResponseModal from '../../../common/ResponseModal';
import { Image } from "cloudinary-react"

export default function DriverResult({ driver, reloadDrivers }) {
    const [showManageModal, setShowManageModal] = useState(false);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [responseModalShow, setResponseModalShow] = useState(false);
    const [errorResponseModalShow, setErrorResponseModalShow] = useState(false);
    const [imageLoadError, setImageLoadError] = useState(false);

    const handleManageButtonClick = () => {
        setShowManageModal(true);
    };

    const handleCloseManageModal = () => {
        setShowManageModal(false);
    };

    const handleDeleteProfile = () => {
        setShowConfirmationModal(true);
    };

    const handleConfirmDelete = async () => {
        setShowConfirmationModal(false);

        const userToken = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
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

    const formatDate = (date) => {
        const dateTime = new Date(date);
        const day = dateTime.getDate();
        const month = dateTime.getMonth() + 1;
        const year = dateTime.getFullYear();
        return `${day}. ${month}. ${year}`;
    };

    return (
        <div className='container-md d-flex result p-2 m-1 shadow'>
            <div className="d-flex one-line-details">
                <div className="profile-pic">
                    {driver.profilePicUrl && !imageLoadError ? (
                        <Image
                            cloudName={import.meta.env.VITE_CLOUD_PRESET}
                            publicId={driver.profilePicUrl}
                            onError={() => setImageLoadError(true)}
                        />
                    ) : (
                        <img src={user} alt="user profile pic" />
                    )}
                </div>
                <div className="user-details">
                    <h2>{`${driver.fname} ${driver.lname}`}</h2>
                    <p>
                        {`Cena/km: `}<span>{`${driver.cost}€`}</span> <br />
                        {`Vozidlo: `}<span>{`${driver.carName}`}</span> <br />
                        {`Počet dokončených jázd: `}<span>{`${driver.ridesCompleted}`}</span> <br />
                        {`Dátum najatia: `}<span>{`${formatDate(driver.hireDate)}`}</span>
                    </p>
                </div>
            </div>
            <div className="options d-flex flex-column">
                <button className='btn btn-outline-danger fs-4 w-100 p-3 align-self-center shadow rounded-pill mb-2' onClick={handleDeleteProfile}>ODSTRÁNIŤ <i className="bi bi-trash3"></i></button>
                <button className='btn btn-primary fs-4 w-100 p-3 align-self-center shadow rounded-pill' onClick={handleManageButtonClick}>SPRAVOVAŤ <i className="bi bi-pen"></i></button>
            </div>
            <DriverManageModal
                show={showManageModal}
                handleClose={handleCloseManageModal}
                driver={driver}
                reloadDrivers={reloadDrivers}
            />

            <ConfirmDeleteUserModal
                show={showConfirmationModal}
                handleClose={handleCancelDelete}
                handleConfirm={handleConfirmDelete}
                message={`Po vymazaní profilu vodiča ${driver.fname} ${driver.lname} sa stratia všetky údaje a prístup vodiča do našej webovej aplikacie bez možnosti obnovenia. Pre opätovný prístup sa bude vyžadovať vytvorenie nového profilu. Naozaj chcete vymazať profil?`}
            />

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

        </div>
    );
}
