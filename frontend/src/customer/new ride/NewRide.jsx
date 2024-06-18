import SearchRideForm from './SearchRideForm'
import SearchRideResults from './SearchRideResults'
import { useState, useEffect } from 'react';
import SearchInfoModal from './SearchInfoModal';
import FilterDriversModal from './FilterDriversModal';
import MassOrderModal from './MassOrderModal';
import ResponseModal from '../../common/ResponseModal';
import axios from "../../security/CrossOrigin";
import DriverOrderModal from './drivers/DriverOrderModal';

export default function NewRide() {
    const userToken = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [userChoseSelf, setUserChoseSelf] = useState(false);
    const [userChoseQuickRide, setUserChoseQuickRide] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showFilterDriversModal, setShowFilterDriversModal] = useState(false);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [orderSuccessModalShow, setOrderSuccessModalShow] = useState(false);
    const [orderErrorModalShow, setOrderErrorModalShow] = useState(false);
    const [orderTimeErrorModalShow, setOrderTimeErrorModalShow] = useState(false);
    const [maxCost, setMaxCost] = useState();
    const [drivers, setDrivers] = useState([]);
    const [showOneDriverOrderModal, setShowOneDriverOrderModal] = useState(false);
    const [searchFormData, setSearchFormData] = useState({
        from: '',
        to: '',
        dateTime: '',
        quantity: 1,
        route: '',
        fromCoordinates: '',
        toCoordinates: '',
        distance: 0,
        time: 0
    });

    const handleFormSubmit = () => {
        setShowModal(true);
        setFormSubmitted(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
    };

    const handleChooseSelf = () => {
        setUserChoseSelf(true);
    };

    const handleQuickRide = () => {
        const lowestPrice = Math.min(...drivers.map(driver => driver.cost));
        const highestPrice = Math.max(...drivers.map(driver => driver.cost));
        setUserChoseQuickRide(true);
        if (drivers.length > 1 && highestPrice === lowestPrice) {
            setShowOrderModal(true);
        } else if (drivers.length > 1) {
            setShowFilterDriversModal(true);
        } else {
            setShowOneDriverOrderModal(true);
        }
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
            const routeJson = searchFormData.route.coordinates.map(point => ({ longitude: point[0], latitude: point[1] }));
            const filteredDrivers = drivers.filter(driver => driver.cost <= (maxCost || Infinity));
            const driverIds = filteredDrivers.map(driver => driver.id);
            const type = filteredDrivers.length > 1 ? "quick" : "driver";
            const data = {
                ...searchFormData,
                route: routeJson,
                driverIds,
                type
            };
            try {
                const response = await axios.post("/customer/order", data, { headers: { Authorization: `Bearer ${userToken}` } });
                if (response?.status === 200) {
                    setShowOrderModal(false);
                    setShowOneDriverOrderModal(false);
                    setOrderSuccessModalShow(true);
                }
            } catch (err) {
                setShowOrderModal(false);
                setShowOneDriverOrderModal(false);
                setOrderErrorModalShow(true);
            }
        } else {
            setShowOrderModal(false);
            setShowOneDriverOrderModal(false);
            setOrderTimeErrorModalShow(true);
        }
    }

    useEffect(() => {
        const searchResultsSection = document.getElementById('searchResults');
        if (searchResultsSection) {
            searchResultsSection.scrollIntoView({ behavior: 'smooth' });
        }
    }, [userChoseSelf]);

    return (
        <>
            <SearchRideForm onSubmit={handleFormSubmit} setSearchFormData={setSearchFormData} setDrivers={setDrivers} />
            <SearchInfoModal show={showModal} handleClose={handleModalClose} onChooseSelf={handleChooseSelf} onQuickRide={handleQuickRide} searchFormData={searchFormData} numOfDrivers={drivers.length} />
            {formSubmitted && userChoseSelf && <SearchRideResults searchFormData={searchFormData} drivers={drivers} />}

            {formSubmitted && userChoseQuickRide && <FilterDriversModal
                show={showFilterDriversModal}
                handleClose={() => { setShowFilterDriversModal(false); }}
                text={`Najdrahší vodič má cenu na 1km nastavenú na ${Math.max(...drivers.map(driver => driver.cost))}€. Najlacnejší vodič má cenu na 1km nastavenú na ${Math.min(...drivers.map(driver => driver.cost))}€
                Na posúvači špecifikujte maximálnu sumu na 1km, ktorú ste ochotný zaplatiť. Požiadavka o jazdu sa pošle len tým vodičom, ktorí nepresahujú
                Vami stanovenú sumu na 1km. Prvý vodič, ktorý Vašu objednávku prijíme bude ten, kto Vás zavezie na Vašu destináciu.`}
                lowestPrice={Math.min(...drivers.map(driver => driver.cost))}
                highestPrice={Math.max(...drivers.map(driver => driver.cost))}
                setMaxCost={setMaxCost}
                setShowOrderModal={setShowOrderModal}
            />}

            <MassOrderModal
                show={showOrderModal}
                handleClose={() => { setShowOrderModal(false); }}
                searchFormData={searchFormData}
                car={null}
                lowestPrice={Math.min(...drivers.map(driver => driver.cost))}
                highestPrice={maxCost}
                createOrder={createOrder}
            />

            {drivers && drivers.length === 1 && (
                <DriverOrderModal
                    show={showOneDriverOrderModal}
                    handleClose={() => { setShowOneDriverOrderModal(false); }}
                    searchFormData={searchFormData}
                    driver={drivers[0]}
                    createOrder={createOrder}
                />
            )}

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

        </>
    );
}