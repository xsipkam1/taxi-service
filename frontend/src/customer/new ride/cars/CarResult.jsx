import carpic from '../../../assets/car.png';
import '../../../styles/result.css';
import { useState } from 'react';
import CarDetailsModal from './CarDetailsModal';
import FilterDriversModal from '../FilterDriversModal';
import MassOrderModal from '../MassOrderModal';
import ResponseModal from '../../../common/ResponseModal';
import axios from '../../../security/CrossOrigin'
import { Image } from "cloudinary-react"

export default function CarResult({ car, searchFormData, drivers }) {
    const userToken = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
    let filteredDrivers = drivers.filter(driver => driver.car.id === car.id);
    const carLowestPrice = Math.min(...car.drivers.map((driver) => driver.cost));
    const carHighestPrice = Math.max(...car.drivers.map((driver) => driver.cost));

    const [carImageLoadError, setCarImageLoadError] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showFilterDriversModal, setShowFilterDriversModal] = useState(false);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [maxCost, setMaxCost] = useState(carHighestPrice);
    const [orderSuccessModalShow, setOrderSuccessModalShow] = useState(false);
    const [orderErrorModalShow, setOrderErrorModalShow] = useState(false);
    const [orderTimeErrorModalShow, setOrderTimeErrorModalShow] = useState(false);

    const handleOrderClick = () => {
        if (car.drivers.length > 1 && carLowestPrice === carHighestPrice) {
            setShowOrderModal(true);
        } else if (car.drivers.length > 1) {
            setShowFilterDriversModal(true);
        } else {
            setShowOrderModal(true);
        }
    }

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
            const routeJson = searchFormData.route.coordinates.map(point => ({ longitude: point[0], latitude: point[1] }));
            filteredDrivers = filteredDrivers.filter(driver => driver.cost <= maxCost);
            const driverIds = filteredDrivers.map(driver => driver.id);
            const data = {
                ...searchFormData,
                route: routeJson,
                driverIds,
                type: "car"
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
            setShowOrderModal(false);
            setOrderTimeErrorModalShow(true);
        }
    }

    return (
        <div className='container-md d-flex result p-2 m-1 shadow'>
            <div className="d-flex one-line-details">
                <div className="profile-pic">
                    {car.carPictureUrl && !carImageLoadError ? (
                        <Image
                            cloudName={import.meta.env.VITE_CLOUD_PRESET}
                            publicId={car.carPictureUrl}
                            onError={() => setCarImageLoadError(true)}
                        />
                    ) : (
                        <img src={carpic} alt="car pic" />
                    )}
                </div>
                <div className="user-details">
                    <h2>{`${car.name}`}</h2>
                    <p>
                        {`Počet vodičov: `}<span>{`${car.drivers.length}`}</span> <br />
                        {`Najmenšia cena/km: `}<span>{`${carLowestPrice}€`}</span> <br />
                        {`Najväčšia cena/km: `}<span>{`${carHighestPrice}€`}</span> <br />
                        {`Miesta pre pasažierov: `}<span>{`${car.passengers}`}</span> <br />
                    </p>
                </div>
            </div>
            <div className="options d-flex flex-column">
                <button className='btn btn-outline-primary fs-4 w-100 p-3 align-self-center shadow rounded-pill mb-2' onClick={() => { setShowDetailsModal(true); }}>DETAILY <i className="bi bi-search"></i></button>
                <button className='btn btn-primary fs-4 w-100 p-3 align-self-center shadow rounded-pill' onClick={handleOrderClick}>OBJEDNAŤ <i className="bi bi-bag-plus"></i></button>
            </div>

            <CarDetailsModal
                show={showDetailsModal}
                handleClose={() => { setShowDetailsModal(false); }}
                car={car}
            />

            <FilterDriversModal
                show={showFilterDriversModal}
                handleClose={() => { setShowFilterDriversModal(false); }}
                text={`${car.drivers.length} vodiči vlastnia vozidlo ${car.name}. Najdrahší vodič má cenu na 1km nastavenú na
                ${carHighestPrice}€. Najlacnejší vodič má cenu na 1km nastavenú
                na ${carLowestPrice}€. Na posúvači špecifikujte maximálnu sumu na 1km, ktorú ste ochotný zaplatiť. Požiadavka o jazdu sa pošle len tým vodičom, ktorí nepresahujú
                Vami stanovenú sumu na 1km. Prvý vodič, ktorý Vašu objednávku prijíme bude ten, kto Vás zavezie na Vašu destináciu.`}
                lowestPrice={carLowestPrice}
                highestPrice={carHighestPrice}
                setMaxCost={setMaxCost}
                setShowOrderModal={setShowOrderModal}
            />

            <MassOrderModal
                show={showOrderModal}
                handleClose={() => { setShowOrderModal(false); }}
                searchFormData={searchFormData}
                car={car}
                lowestPrice={carLowestPrice}
                highestPrice={maxCost}
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
