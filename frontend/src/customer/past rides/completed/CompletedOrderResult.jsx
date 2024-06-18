import line from '../../../assets/line.png';
import '../../../styles/orderresult.css';
import { useState } from 'react';
import LeaveReviewModal from './LeaveReviewModal';

export default function CompletedOrderResult({ order }) {

    const [leaveReviewModal, setLeaveReviewModal] = useState(false);

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

    const handleLeaveReviewClick = () => {
        setLeaveReviewModal(true);
    };

    const title = order.type === "driver" ? `${order.drivers[0].fname} ${order.drivers[0].lname}` : `${order.drivers[0].car.name}`;
    const secondTitle = order.type === "driver" ? `${order.drivers[0].car.name}` : `${order.drivers[0].fname} ${order.drivers[0].lname}`;

    const rideType = `${order.type === 'driver' ? '(objednávka vodiča)' : ''}
                    ${order.type === 'car' ? '(objednávka vozidla)' : ''}
                    ${order.type === 'quick' ? '(rýchla jazda)' : ''}`;

    const costDetails = `${(order.drivers[0].cost * order.distance).toFixed(2)}€`;

    return (
        <div className='container-md d-flex result p-2 m-1 order-details shadow'>
            <div className="d-flex flex-3">
                <div className="ride-details position-relative">
                    <span className='d-flex justify-content-between align-items-center'>
                        <span className='d-flex accepted-title'>
                            <h2 className={`m-0 title align-self-start ${order.type === 'quick' ? 'text-muted' : ''}`}>{title}</h2>
                            <h4 className='m-1 text-muted ms-4 second-title'>{secondTitle}</h4>
                        </span>
                        <p className='text-secondary align-self-end m-0 fs-4 mobile-hide'>{rideType}</p>
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
                    <img src={line} alt="" className='line accepted-line' /> <br />
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
                <button className='btn btn-primary fs-4 w-100 p-3 align-self-center shadow rounded-pill' onClick={handleLeaveReviewClick}>OHODNOTIŤ <i className="bi bi-star"></i></button>
            </div>

            <LeaveReviewModal
                show={leaveReviewModal}
                handleClose={() => setLeaveReviewModal(false)}
                driver={order.drivers[0]}
                order={order}
            />

        </div>
    );
}
