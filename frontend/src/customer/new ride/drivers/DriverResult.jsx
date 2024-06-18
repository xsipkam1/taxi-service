import user from '../../../assets/user.png';
import '../../../styles/result.css';
import { useState } from 'react';
import DriverProfileModal from './DriverProfileModal';
import DriverOrderModal from './DriverOrderModal';
import ResponseModal from '../../../common/ResponseModal';
import axios from "../../../security/CrossOrigin";
import { Image } from "cloudinary-react"

export default function DriverResult({ driver, searchFormData }) {
    const userToken = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [orderSuccessModalShow, setOrderSuccessModalShow] = useState(false);
    const [orderErrorModalShow, setOrderErrorModalShow] = useState(false);
    const [orderTimeErrorModalShow, setOrderTimeErrorModalShow] = useState(false);
    const [carImageLoadError, setCarImageLoadError] = useState(false);
    const [imageLoadError, setImageLoadError] = useState(false);

    const handleProfileButtonClick = () => {
        setShowProfileModal(true);
    };

    const handleCloseProfileModal = () => {
        setShowProfileModal(false);
    };

    const handleOrderButtonClick = () => {
        setShowOrderModal(true);
    };

    const handleCloseOrderModal = () => {
        setShowOrderModal(false);
    };

    const isToday = (providedDateTime) => {
        const currentDate = new Date();
        const isToday = (
            providedDateTime.getDate() === currentDate.getDate() &&
            providedDateTime.getMonth() === currentDate.getMonth() &&
            providedDateTime.getFullYear() === currentDate.getFullYear()
        );
        return isToday;
    }

    const validateTime = (dateTimeString) => {
        const currentDate = new Date();
        const providedDateTime = new Date(dateTimeString);
        if (isToday(providedDateTime)) {
            const isTimeAhead = (
                providedDateTime.getTime() - currentDate.getTime() >= 5 * 60 * 1000
            );
            return isTimeAhead;
        }
        const providedYear = providedDateTime.getFullYear();
        const providedMonth = providedDateTime.getMonth();
        const providedDay = providedDateTime.getDate();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();
        const currentDay = currentDate.getDate();
        if (providedYear > currentYear || (providedYear === currentYear && (providedMonth > currentMonth || (providedMonth === currentMonth && providedDay > currentDay)))) {
            return true;
        } else {
            return false;
        }
    }

    const createOrder = async () => {
        if (validateTime(searchFormData.dateTime)) {
            const routeJson = searchFormData.route.coordinates.map(point => ({
                longitude: point[0],
                latitude: point[1]
            }));
            const data = {
                ...searchFormData,
                route: routeJson,
                driverIds: [driver.id],
                type: "driver"
            };
            try {
                const response = await axios.post("/customer/order", data, { headers: { Authorization: `Bearer ${userToken}` } });
                if (response?.status === 200) {
                    setShowOrderModal(false);
                    setOrderSuccessModalShow(true);
                }
            } catch (err) {
                setShowOrderModal(false);
                setOrderErrorModalShow(true);
            }
        } else {
            handleCloseOrderModal();
            setOrderTimeErrorModalShow(true);
        }
    }

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
                        {`Vozidlo: `}<span>{`${driver.car.name}`}</span> <br />
                        {driver.ranking !== 0 ? <>Hodnotenie: <span>{driver.ranking}/5</span></> : "Hodnotenie: -"} <br />
                        {`Dokončené jazdy: `}<span>{`${driver.ridesCompleted}`}</span> <br />
                    </p>
                </div>
            </div>

            <div className="options d-flex flex-column">
                <button className='btn btn-outline-primary fs-4 w-100 p-3 align-self-center shadow rounded-pill mb-2' onClick={handleProfileButtonClick}>PROFIL <i className="bi bi-person"></i></button>
                <button className='btn btn-primary fs-4 w-100 p-3 align-self-center shadow rounded-pill' onClick={handleOrderButtonClick}>OBJEDNAŤ <i className="bi bi-bag-plus"></i></button>
            </div>

            <DriverProfileModal
                show={showProfileModal}
                handleClose={handleCloseProfileModal}
                driver={driver}
            />

            <DriverOrderModal
                show={showOrderModal}
                handleClose={handleCloseOrderModal}
                searchFormData={searchFormData}
                driver={driver}
                createOrder={createOrder}
            />

            <ResponseModal
                show={orderSuccessModalShow}
                handleClose={() => { setOrderSuccessModalShow(false); window.location.href = '/customer/activerides'; }}
                title="ÚSPEŠNE OBJEDNANÉ"
                message={`Vašu objednávku sme úspešne obdržali. V sekcii aktívne jazdy si môžete skontrolovať stav Vašej objednávky.`}
            />

            <ResponseModal
                show={orderErrorModalShow}
                handleClose={() => { setOrderErrorModalShow(false); }}
                title="CHYBA"
                message={`Pri spracovávaní objednávky nastala chyba. Skúste to prosím znovu neskôr.`}
            />

            <ResponseModal
                show={orderTimeErrorModalShow}
                handleClose={() => { setOrderTimeErrorModalShow(false); }}
                title="CHYBA"
                message={`Pre úspešné objednanie jazdy je potrebné zadať minimálne dnešný dátum a čas aspoň o 5 minút neskôr od súčasného času.`}
            />

        </div>
    );
}
