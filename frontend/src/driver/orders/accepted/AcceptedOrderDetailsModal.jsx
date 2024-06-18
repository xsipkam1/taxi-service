import { Modal, Button } from 'react-bootstrap';
import '../../../styles/profilemodal.css';
import '../../../styles/myprofile.css';
import '../../../styles/order.css';
import user from '../../../assets/user.png';
import Map from '../../../common/Map'
import { Image } from "cloudinary-react"
import { useState } from 'react';

export default function AcceptedOrderDetailsModal({ show, handleClose, order }) {
    const [imageLoadError, setImageLoadError] = useState(false);
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

    return (
        <Modal show={show} onHide={handleClose} centered className='modal-xl'>
            <Modal.Header className='text-center' closeButton>
                <Modal.Title className="fs-1 w-100">OBJEDNÁVKA</Modal.Title>
            </Modal.Header>
            <Modal.Body className="fs-5">
                <div className="order-modal d-flex">
                    <Map
                        from={order.fromCoordinates}
                        to={order.toCoordinates}
                        route={order.route}
                    />
                    <div className="right-col align-self-center w-100 d-flex flex-column ">
                        <div className='d-flex justify-content-center mb-3'>
                            <h3 className='m-0'>{`${order.customer.fname} ${order.customer.lname}`}</h3>
                        </div>
                        <div id="carouselExampleIndicators" className="carousel slide order-modal-profile-pic align-self-center">
                            <div className="carousel-inner ">
                                <div className="carousel-item active ">
                                    {order.customer.profilePicUrl && !imageLoadError ? (
                                        <Image
                                            cloudName={import.meta.env.VITE_CLOUD_PRESET}
                                            publicId={order.customer.profilePicUrl}
                                            onError={() => setImageLoadError(true)}
                                            className='d-block w-100'
                                        />
                                    ) : (
                                        <img src={user} className='d-block w-100' alt="user profile pic" />
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className='d-flex justify-content-center mt-3'>
                            <span className="text-center"><i className="bi bi-telephone"></i> +{`${order.customer.telephone}`}</span>
                        </div>

                        <hr />

                        <div className="personal-details">
                            <div className="detail-line mb-0">
                                <span className="label fw-light">Odkiaľ:</span>
                                <span className="value">{`${order.from}`}</span>
                            </div>
                            <div className="detail-line mb-0">
                                <span className="label fw-light">Kam:</span>
                                <span className="value">{`${order.to}`}</span>
                            </div>
                            <div className="detail-line mb-0">
                                <span className="label fw-light">Kedy:</span>
                                <span className="value">{`${formatDateTime(order.dateTime)}`}</span>
                            </div>
                            <div className="detail-line mb-0">
                                <span className="label fw-light">Cestujúci:</span>
                                <span className="value">{`${order.quantity}`}</span>
                            </div>
                            <div className="detail-line mb-0">
                                <span className="label fw-light">Dĺžka trasy:</span>
                                <span className="value">{`${order.distance}km`}</span>
                            </div>
                            <div className="detail-line mb-0">
                                <span className="label fw-light">Odhadovaný čas:</span>
                                <span className="value">
                                    {Math.floor(order.time) > 0 && `${Math.floor(order.time)} hod `}
                                    {Math.round((order.time - Math.floor(order.time)) * 60)} min
                                </span>
                            </div>

                            <div className="detail-line mb-0">
                                <span className="label fw-light">Vaša cena/km:</span>
                                <span className="value">{`${order.driverCost}€`}</span>
                            </div>

                            <hr />
                            <div className="detail-line mb-0">
                                <h2 className="label"><strong>CENA:</strong></h2>
                                <h2 className="value"><strong>{`${(order.driverCost * order.distance).toFixed(2)}€`}</strong></h2>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer className="justify-content-center">
                <Button className='fs-5' variant="outline-primary rounded-pill" onClick={handleClose}>
                    ZATVORIŤ
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
