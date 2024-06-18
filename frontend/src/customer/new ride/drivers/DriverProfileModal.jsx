import { Modal, Button } from 'react-bootstrap';
import user from '../../../assets/user.png';
import car from '../../../assets/car.png';
import '../../../styles/profilemodal.css';
import '../../../styles/myprofile.css';
import Review from "../../../common/Review.jsx"
import { Image } from "cloudinary-react"
import { useState } from 'react';

export default function DriverProfileModal({ show, handleClose, driver }) {

    const [carImageLoadError, setCarImageLoadError] = useState(false);
    const [imageLoadError, setImageLoadError] = useState(false);

    return (
        <Modal show={show} onHide={handleClose} centered scrollable className='modal-xl'>
            <Modal.Header className='text-center' closeButton>
                <Modal.Title className="fs-1 w-100">{`${driver.fname} ${driver.lname}`}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="fs-5">
                <div className="profile-details-modal d-flex">
                    <div className="profile-pic-modal text-center">

                        <div id="carouselExampleIndicators" className="carousel slide profile-modal-profile-pic mx-auto">
                            <div className="carousel-indicators">
                                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
                            </div>
                            <div className="carousel-inner">
                                <div className="carousel-item active">
                                    {driver.profilePicUrl && !imageLoadError ? (
                                        <Image
                                            cloudName={import.meta.env.VITE_CLOUD_PRESET}
                                            publicId={driver.profilePicUrl}
                                            onError={() => setImageLoadError(true)}
                                            className='d-block w-100'
                                        />
                                    ) : (
                                        <img src={user} className='d-block w-100' alt="user profile pic" />
                                    )}
                                </div>
                                <div className="carousel-item">
                                    {driver.car.carPictureUrl && !carImageLoadError ? (
                                        <Image
                                            cloudName={import.meta.env.VITE_CLOUD_PRESET}
                                            publicId={driver.car.carPictureUrl}
                                            onError={() => setCarImageLoadError(true)}
                                            className='d-block w-100'
                                        />
                                    ) : (
                                        <img src={car} className="d-block w-100" alt="car pic" />
                                    )}
                                </div>
                            </div>
                            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">Previous</span>
                            </button>
                            <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">Next</span>
                            </button>
                        </div>

                    </div>
                    <div className="right-col align-self-center w-100 ms-5 me-5">
                        <div className="personal-details">
                            <div className="detail-line mb-0">
                                <span className="label">Vozidlo:</span>
                                <span className="value"><strong>{`${driver.car.name}`}</strong></span>
                            </div>
                            <div className="detail-line mb-0">
                                <span className="label">Cena/km:</span>
                                <span className="value"><strong>{`${driver.cost}€`}</strong></span>
                            </div>
                            <div className="detail-line mb-0">
                                <span className="label">Hodnotenie:</span>
                                <span className="value"><strong>{driver.ranking !== 0 ? `${driver.ranking}/5` : "-/5"}</strong></span>
                            </div>
                            <div className="detail-line mb-0">
                                <span className="label">Počet hodnotení:</span>
                                <span className="value"><strong>{`${driver.reviews.length}`}</strong></span>
                            </div>
                            <div className="detail-line mb-0">
                                <span className="label">Dokončené jazdy:</span>
                                <span className="value"><strong>{`${driver.ridesCompleted}`}</strong></span>
                            </div>
                            <div className="detail-line mb-0">
                                <span className="label">Tel.č.:</span>
                                <span className="value"><strong>{`${driver.telephone}`}</strong></span>
                            </div>
                        </div>
                    </div>
                </div>

                {driver.reviews.some(review => review.plus.trim() !== '' || review.minus.trim() !== '') && (
                    <>
                        <h2 className='mt-5'>RECENZIE:</h2>
                        {driver.reviews.map((review) => (
                            (review.plus.trim() !== '' || review.minus.trim() !== '') && (
                                <Review
                                    key={review.id}
                                    review={review}
                                />
                            )
                        ))}
                    </>
                )}

            </Modal.Body>
            <Modal.Footer className="justify-content-center">
                <Button className='fs-5' variant="outline-primary rounded-pill" onClick={handleClose}>
                    ZATVORIŤ
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
