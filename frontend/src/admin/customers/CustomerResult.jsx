import user from '../../assets/user.png';
import '../../styles/result.css';
import { useState } from 'react';
import ConfirmDeleteUserModal from '../../common/ConfirmDeleteModal';
import ResponseModal from '../../common/ResponseModal';
import axios from '../../security/CrossOrigin'
import { Image } from "cloudinary-react"

export default function CustomerResult({ customer, reloadCustomers }) {
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [responseModalShow, setResponseModalShow] = useState(false);
    const [errorResponseModalShow, setErrorResponseModalShow] = useState(false);
    const [imageLoadError, setImageLoadError] = useState(false);

    const handleDeleteProfile = () => {
        setShowConfirmationModal(true);
    };

    const handleConfirmDelete = async () => {
        setShowConfirmationModal(false);

        const userToken = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
        const result = await axios.delete(`/admin/delete-customer/${customer.id}`, { headers: { Authorization: `Bearer ${userToken}` } });
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
                    {customer.profilePicUrl && !imageLoadError ? (
                        <Image
                            cloudName={import.meta.env.VITE_CLOUD_PRESET}
                            publicId={customer.profilePicUrl}
                            onError={() => setImageLoadError(true)}
                        />
                    ) : (
                        <img src={user} alt="user profile pic" />
                    )}
                </div>
                <div className="user-details">
                    <h2>{`${customer.fname} ${customer.lname}`}</h2>
                    <p>
                        {`Dátum registrácie: `}<span>{formatDate(customer?.registrationDate)}</span> <br />
                        {`Tel.č.: `}<span>{`${customer.telephone}`}</span> <br />
                        {`Počet objednávok: `}<span>{`${customer.ordersCount}`}</span> <br />
                        {`Total suma objednávok: `}<span>{`${customer.ordersWorth.toFixed(2)}€`}</span>
                    </p>
                </div>
            </div>
            <div className="options d-flex flex-column">
                <button className='btn btn-outline-danger fs-4 w-100 p-3 align-self-center shadow rounded-pill mb-3' onClick={handleDeleteProfile}>ODSTRÁNIŤ <i className="bi bi-trash3"></i></button>
            </div>

            <ConfirmDeleteUserModal
                show={showConfirmationModal}
                handleClose={handleCancelDelete}
                handleConfirm={handleConfirmDelete}
                message={`Po vymazaní profilu zákazníka ${customer.fname} ${customer.lname} sa stratia všetky údaje a prístup zákazníka do našej webovej aplikacie bez možnosti obnovenia. Pre opätovný prístup sa bude vyžadovať vytvorenie nového profilu. Naozaj chcete vymazať profil?`}
            />

            <ResponseModal
                show={responseModalShow}
                handleClose={() => { setResponseModalShow(false); reloadCustomers(); }}
                title="ÚSPEŠNE VYMAZANÉ"
                message={`Úspešne ste vymazali profil zákazníka ${customer.fname} ${customer.lname}.`}
            />

            <ResponseModal
                show={errorResponseModalShow}
                handleClose={() => { setErrorResponseModalShow(false); }}
                title="CHYBA"
                message={`Pri vymazávaní profilu zákazníka ${customer.fname} ${customer.lname} nastala chyba.`}
            />

        </div>
    );
}