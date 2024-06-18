import line from '../../../assets/line.png';
import '../../../styles/orderresult.css';
import { useState } from 'react';
import ViewReviewModal from './ViewReviewModal'

export default function AcceptedOrderResult({ order, reload }) {
    const [showReviewModal, setShowReviewModal] = useState(false);

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


    const handleViewReviewClick = () => {
        setShowReviewModal(true);
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
                <button className='btn btn-primary fs-4 w-100 p-3 align-self-center shadow rounded-pill' onClick={handleViewReviewClick}>HODNOTENIE <i className="bi bi-star"></i></button>
            </div>

            <ViewReviewModal
                show={showReviewModal}
                handleClose={() => setShowReviewModal(false)}
                order={order}
            />


        </div>
    );
}
