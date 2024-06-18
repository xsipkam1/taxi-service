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

    const title = `${order.customer.fname} ${order.customer.lname}`;

    const costDetails = `${(order.driverCost * order.distance).toFixed(2)}€`;

    const handleCancelDeleteOrder = () => {
        setShowConfirmationModal(false);
    };

    const handleDeleteOrder = () => {
        setShowConfirmationModal(true);
    };

    const handleConfirmDelete = async () => {
        const result = await axios.delete(`/driver/delete-denied/${order.id}`, { headers: { Authorization: `Bearer ${userToken}` } });
        setShowConfirmationModal(false);
        if(result?.status === 200) {
            setResponseModalShow(true);
        } else {
            setErrorResponseModalShow(true);
        }
    };

    return (
        <div className='container-md d-flex result p-2 m-1 order-details shadow'>
            <div className="d-flex flex-3">
                <div className="ride-details  position-relative">
                    <span className='d-flex justify-content-between'>
                        <span className='d-flex accepted-title'>
                            <h2 className={`m-0 title align-self-start ${order.type === 'quick' ? 'text-muted' : ''}`}>{title}</h2>
                        </span>
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

                    <span className='mobile-show d-flex flex-row-reverse'>
                        <span className=' mobile-show display-5 cost'>{costDetails}</span>
                    </span>
                </div>
            </div>
            <div className="options d-flex flex-column order-options">
                <button className='btn btn-outline-danger fs-4 w-100 p-3 align-self-center shadow rounded-pill mb-2' onClick={handleDeleteOrder}>VYMAZAŤ <i className="bi bi-trash"></i></button>
            </div>

            <ConfirmDeleteModal
                show={showConfirmationModal}
                handleClose={handleCancelDeleteOrder}
                handleConfirm={handleConfirmDelete}
                message={`Naozaj chcete odstrániť objednávku?`}
            />

            <ResponseModal
                show={responseModalShow}
                handleClose={() => { setResponseModalShow(false); reload();}}
                title="ÚSPEŠNE ODSTRÁNENÉ"
                message={`Úspešne ste odstránili objednávku.`}
            />

            <ResponseModal
                show={errorResponseModalShow}
                handleClose={() => { setErrorResponseModalShow(false); }}
                title="CHYBA"
                message={`Pri odstraňovaní objednávky nastala chyba.`}
            />

        </div>
    );
}
