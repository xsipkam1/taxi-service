import { Modal, Button } from 'react-bootstrap';
import carpic from '../../../assets/car.png';
import user from '../../../assets/user.png';
import '../../../styles/profilemodal.css';
import '../../../styles/myprofile.css';
import '../../../styles/result.css';
import Review from '../../../common/Review';
import { useState } from 'react';
import { Image } from "cloudinary-react"

export default function CarDetailsModal({ show, handleClose, car }) {
    const [carImageLoadError, setCarImageLoadError] = useState(false);
    const [imageLoadError, setImageLoadError] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(true);

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    const carLowestPrice = Math.min(...car.drivers.map((driver) => driver.cost));
    const carHighestPrice = Math.max(...car.drivers.map((driver) => driver.cost));

    return (
        <Modal show={show} onHide={() => { handleClose(); setIsCollapsed(true); }} centered scrollable className='modal-xl'>
            <Modal.Header className='text-center' closeButton>
                <Modal.Title className="fs-1 w-100">{`${car.name}`}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="fs-5">
                <div className="profile-details-modal d-flex">
                    <div className="profile-pic-modal text-center">
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
                    <div className="right-col align-self-center w-100 ms-5 me-5">
                        <div className="personal-details">
                            <div className="detail-line mb-0">
                                <span className="label">Počet vodičov:</span>
                                <span className="value"><strong>{`${car.drivers.length}`}</strong></span>
                            </div>
                            <div className="detail-line mb-0">
                                <span className="label">Najmenšia cena/km:</span>
                                <span className="value"><strong>{`${carLowestPrice}€`}</strong></span>
                            </div>
                            <div className="detail-line mb-0">
                                <span className="label">Najväčšia cena/km:</span>
                                <span className="value"><strong>{`${carHighestPrice}€`}</strong></span>
                            </div>
                            <div className="detail-line mb-0">
                                <span className="label">Miesta pre pasažierov:</span>
                                <span className="value"><strong>{`${car.passengers}`}</strong></span>
                            </div>
                        </div>
                    </div>
                </div>

                <>
                    <h2 className='mt-5'>VODIČI:</h2>
                    {car.drivers.map((driver) => (
                        <div key={driver.id}>
                            <div className='container-md d-flex result p-2 m-1 shadow'>
                                <div className="d-flex one-line-details">
                                    <div className="review-profile-pic">
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
                                            {driver.ranking !== 0 ? <>Hodnotenie: <span>{driver.ranking}/5</span></> : "Hodnotenie: -"} <br />
                                            {`Počet hodnotení: `}<span>{`${driver.reviews.length}`}</span> <br />
                                            {`Dokončené jazdy: `}<span>{`${driver.ridesCompleted}`}</span> <br />
                                        </p>
                                    </div>
                                </div>
                                <div className="options d-flex flex-column">
                                    {driver.reviews.some(review => review.plus.trim() !== '' || review.minus.trim() !== '') && (
                                        <button className="btn btn-primary fs-4 w-100 p-3 align-self-center shadow rounded-pill" data-bs-toggle="collapse" href="#collapseExample" role="button" aria-expanded={!isCollapsed} aria-controls="collapseExample" onClick={toggleCollapse}>
                                            RECENZIE <i className={`bi bi-caret-${isCollapsed ? 'down' : 'up'}-fill`}></i>
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="collapse mt-2" id="collapseExample">
                                <div className="ms-5">
                                    {driver.reviews.map((review) => (
                                        (review.plus.trim() !== '' || review.minus.trim() !== '') && (
                                            <Review
                                                key={review.id}
                                                review={review}
                                            />
                                        )
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </>

            </Modal.Body>
            <Modal.Footer className="justify-content-center">
                <Button className='fs-5 rounded-pill' variant="outline-primary" onClick={() => { handleClose(); setIsCollapsed(true); }}>
                    ZATVORIŤ
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
