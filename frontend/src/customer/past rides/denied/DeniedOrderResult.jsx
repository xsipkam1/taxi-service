import line from '../../../assets/line.png';
import '../../../styles/orderresult.css';
import { useState } from 'react';
import ConfirmDeleteModal from '../../../common/ConfirmDeleteModal';
import ResponseModal from '../../../common/ResponseModal';
import axios from "../../../security/CrossOrigin"

export default function DeniedOrderResult({ order, reload }) {
    const userToken = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [responseModalShow, setResponseModalShow] = useState(false);
    const [errorResponseModalShow, setErrorResponseModalShow] = useState(false);

    const handleDeleteOrder = () => {
        setShowConfirmationModal(true);
    };

    const handleConfirmDelete = async () => {
        const result = await axios.delete(`/customer/delete-denied/${order.id}`, { headers: { Authorization: `Bearer ${userToken}` } });
        setShowConfirmationModal(false);
        if(result?.status === 200) {
            setResponseModalShow(true);
        } else {
            setErrorResponseModalShow(true);
        }
    };

    const handleCancelDeleteOrder = () => {
        setShowConfirmationModal(false);
    };

    const formatDateTime = (dateTimeString) => {
        const dateTime = new Date(dateTimeString);
        const day = dateTime.getDate();
        const month = dateTime.getMonth() + 1;
        const year = dateTime.getFullYear();
        const hours = dateTime.getHours();
        const minutes = dateTime.getMinutes();
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        return `${day}.${month}.${year} ${hours}:${formattedMinutes}`;
    };

    const drivers = order.drivers.length > 0 ? order.drivers : order.deniedDrivers;
    const costs = drivers.map(driver => driver.cost);
    const highestCost = Math.max(...costs);
    const lowestCost = Math.min(...costs);
    const title = ` ${order.type === 'driver' ? `${drivers[0].fname} ${drivers[0].lname}` : ''}
                ${order.type === 'car' ? drivers[0].car.name : ''}
                ${order.type === 'quick' ? 'Náhodný vodič / vozidlo' : ''}`;

    const rideType = `  ${order.type === 'driver' ? '(objednávka vodiča)' : ''}
                    ${order.type === 'car' ? '(objednávka vozidla)' : ''}
                    ${order.type === 'quick' ? '(rýchla jazda)' : ''}`;

    const costDetails = `${order.type === 'driver' ? `${(drivers[0].cost * order.distance).toFixed(2)}€` : ''}
                    ${order.type === 'car' ? (
                        highestCost === lowestCost
                ? `${(highestCost * order.distance).toFixed(2)}€`
                : `${(lowestCost * order.distance).toFixed(2)}€-${(highestCost * order.distance).toFixed(2)}€`
        ) : ''}
                    ${order.type === 'quick' ? (
            order.lowestCost === order.highestCost
                ? `${(highestCost * order.distance).toFixed(2)}€`
                : `${(lowestCost * order.distance).toFixed(2)}€-${(highestCost * order.distance).toFixed(2)}€`
        ) : ''}`;

    return (
        <div className='container-md d-flex result p-2 m-1 order-details shadow'>
            <div className="d-flex flex-3">
                <div className="ride-details position-relative">
                    <span className='d-flex justify-content-between align-items-center'>
                        <span className='d-flex accepted-title'>
                            <h2 className='m-0 title'>{title}</h2>
                        </span>
                        <p className='text-secondary fs-4 mobile-hide m-0 align-self-end'>{rideType}</p>
                    </span>
                    <hr className='m-1' />
                    <div className='d-flex justify-content-between'>
                        <span className='fw-normal fs-3'>
                            <i className="bi bi-geo-alt-fill "></i><span className='place'>{`${order.from}`}</span>
                        </span>
                        <span className='text-secondary fs-5 text-end mobile-hide'>
                            <i className="bi bi-clock"></i>{` ${formatDateTime(order.dateTime)}`}<br />
                            <span className=''>
                                {`${order.quantity} cestujúci `}<i className="bi bi-people-fill"></i>
                            </span>
                        </span>
                    </div>
                    <img src={line} alt="" className='line' /> <br />
                    <div className='d-flex justify-content-between'>
                        <span className='fw-normal align-self-end fs-3'>
                            <i className="bi bi-geo-alt-fill"></i><span className='place'>{`${order.to}`}</span>
                        </span>
                        <span className='display-5 text-end cost mobile-hide'>
                            {costDetails}
                        </span>
                    </div>



                    <hr className='m-1 mobile-show' />



                    <span className='mobile-show d-flex justify-content-between mobile-show-row'>
                        <span className='mobile-show'>
                            <i className="bi bi-clock"></i>{` ${formatDateTime(order.dateTime)}`}
                        </span>
                        <span className='mobile-show'>
                            {`${order.quantity} cestujúci `}<i className="bi bi-people-fill"></i>
                        </span>
                    </span>

                    <span className='mobile-show d-flex justify-content-between'>
                        <span className='mobile-show align-self-center'>{rideType}</span>
                        <span className=' mobile-show display-5 cost'>{costDetails}</span>
                    </span>
                </div>
            </div>
            <div className="options d-flex flex-column order-options">
                <button className='btn btn-outline-danger fs-4 w-100 p-3 align-self-center shadow rounded-pill mb-2' onClick={handleDeleteOrder}>ODSTRÁNIŤ <i className="bi bi-trash3"></i></button>
            </div>

            <ConfirmDeleteModal
                show={showConfirmationModal}
                handleClose={handleCancelDeleteOrder}
                handleConfirm={handleConfirmDelete}
                message={`Naozaj chcete odstrániť objednávku? Pokiaľ sa objednávka odstráni, zmizne zo zoznamu zamietnutých objednávok a to bez možnosti obnovenia.`}
            />

            <ResponseModal
                show={responseModalShow}
                handleClose={() => { setResponseModalShow(false); reload();}}
                title="ÚSPEŠNE ODSTRÁNENÉ"
                message={`Úspešne ste odstránili objednávku zo zoznamu zamietnutých jázd.`}
            />

            <ResponseModal
                show={errorResponseModalShow}
                handleClose={() => { setErrorResponseModalShow(false); }}
                title="CHYBA"
                message={`Pri odstráňovaní objednávky nastala chyba.`}
            />

        </div>
    );
}
