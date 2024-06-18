import { Modal, Button } from 'react-bootstrap';
import '../../../styles/profilemodal.css';
import '../../../styles/myprofile.css';
import '../../../styles/order.css';
import Map from '../../../common/Map'

export default function DriverOrderModal({ show, handleClose, searchFormData, driver, createOrder }) {

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
                        from={searchFormData.fromCoordinates}
                        to={searchFormData.toCoordinates}
                        route={searchFormData.route}
                    />
                    <div className="right-col align-self-center w-100">
                        <div className="personal-details">
                            <div className="detail-line mb-0">
                                <span className="label fw-light">Odkiaľ:</span>
                                <span className="value">{`${searchFormData.from}`}</span>
                            </div>
                            <div className="detail-line mb-0">
                                <span className="label fw-light">Kam:</span>
                                <span className="value">{`${searchFormData.to}`}</span>
                            </div>
                            <div className="detail-line mb-0">
                                <span className="label fw-light">Kedy:</span>
                                <span className="value">{`${formatDateTime(searchFormData.dateTime)}`}</span>
                            </div>
                            <div className="detail-line mb-0">
                                <span className="label fw-light">Cestujúci:</span>
                                <span className="value">{`${searchFormData.quantity}`}</span>
                            </div>
                            <div className="detail-line mb-0">
                                <span className="label fw-light">Vodič:</span>
                                <span className="value">{`${driver.fname} ${driver.lname}`}</span>
                            </div>
                            <div className="detail-line mb-0">
                                <span className="label fw-light">Tel.č.:</span>
                                <span className="value">{`${driver.telephone}`}</span>
                            </div>
                            <div className="detail-line mb-0">
                                <span className="label fw-light">Cena/km:</span>
                                <span className="value">{`${driver.cost}€`}</span>
                            </div>
                            <div className="detail-line mb-0">
                                <span className="label fw-light">Vozidlo:</span>
                                <span className="value">{`${driver.car.name}`}</span>
                            </div>
                            <div className="detail-line mb-0">
                                <span className="label fw-light">Dĺžka trasy:</span>
                                <span className="value">{`${searchFormData.distance}km`}</span>
                            </div>
                            <div className="detail-line mb-0">
                                <span className="label fw-light">Odhadovaný čas:</span>
                                <span className="value">
                                    {Math.floor(searchFormData.time) > 0 && `${Math.floor(searchFormData.time)} hod `}
                                    {Math.round((searchFormData.time - Math.floor(searchFormData.time)) * 60)} min
                                </span>
                            </div> <hr />
                            <div className="detail-line mb-0">
                                <h2 className="label"><strong>CELKOVÁ SUMA:</strong></h2>
                                <h2 className="value"><strong>{`${(driver.cost * searchFormData.distance).toFixed(2)}€`}</strong></h2>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer className="justify-content-center">
                <Button className='fs-5 rounded-pill' variant="primary" onClick={createOrder}>
                    OBJEDNAŤ
                </Button>
                <Button className='fs-5 rounded-pill' variant="outline-primary" onClick={handleClose}>
                    ZATVORIŤ
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
