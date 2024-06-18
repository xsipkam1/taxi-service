import { Modal, Button } from 'react-bootstrap';
import { useState } from 'react';
import { Rating } from 'react-simple-star-rating'
import '../../../styles/profilemodal.css';
import '../../../styles/myprofile.css';
import '../../../styles/order.css';
import '../../../styles/review.css';
import user from '../../../assets/user.png';
import car from '../../../assets/car.png';
import axios from "../../../security/CrossOrigin"
import { Image } from "cloudinary-react"

export default function LeaveReviewModal({ show, handleClose, driver, order }) {
    const userToken = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [isErrorAlertVisible, setIsErrorAlertVisible] = useState(false);
    const [likedText, setLikedText] = useState(order.review ? order.review.plus : "");
    const [improvementText, setImprovementText] = useState(order.review ? order.review.minus : "");
    const [likedTextError, setLikedTextError] = useState('');
    const [improvementTextError, setImprovementTextError] = useState('');
    const [ratingValue, setRatingValue] = useState(order.review ? order.review.rating : 0);
    const [carImageLoadError, setCarImageLoadError] = useState(false);
    const [imageLoadError, setImageLoadError] = useState(false);
    const [rating, setRating] = useState({
        orderId: order.id,
        rating: order.review ? order.review.rating : 0,
        plus: order.review ? order.review.plus : "",
        minus: order.review ? order.review.minus : ""
    });

    const handleRating = (rate) => {
        setRating((prevRating) => ({ ...prevRating, rating: rate }));
        setRatingValue(rate);
    }

    const postReview = async () => {
        if (!likedTextError && !improvementTextError && ratingValue > 0) {
            const response = await axios.post(`/customer/post-review/${order.id}`, rating, { headers: { Authorization: `Bearer ${userToken}` } });
            setIsAlertVisible(true);
            setTimeout(() => {
                setIsAlertVisible(false);
            }, 3000);
        } else {
            setIsErrorAlertVisible(true);
            setTimeout(() => {
                setIsErrorAlertVisible(false);
            }, 3000);
        }
    }

    const handleLikedTextChange = (event) => {
        const text = event.target.value;
        setLikedText(text);
        setRating((prevRating) => ({ ...prevRating, plus: text }));
        if (text.length > 200) {
            setLikedTextError('Maximálne 200 znakov.');
        } else {
            setLikedTextError('');
        }
    };

    const handleImprovementTextChange = (event) => {
        const text = event.target.value;
        setImprovementText(text);
        setRating((prevRating) => ({ ...prevRating, minus: text }));
        if (text.length > 200) {
            setImprovementTextError('Maximálne 200 znakov.');
        } else {
            setImprovementTextError('');
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered className='modal-xl'>
            <Modal.Header className='text-center' closeButton>
                <Modal.Title className="fs-1 w-100">ZANECHAJTE RECENZIU</Modal.Title>
            </Modal.Header>
            <Modal.Body className="fs-5">
                <div className='d-flex justify-content-center mb-3 leave-review-title'>
                    <h3 className='m-0'>{`${driver.fname} ${driver.lname}`}</h3>
                    <h4 className='text-muted ms-2 mb-0 align-self-center'>({`${driver.car.name}`})</h4>
                </div>
                <div id="carouselExampleIndicators" className="carousel slide order-modal-profile-pic mx-auto leave-review-profile-pic">
                    <div className="carousel-indicators">
                        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
                    </div>
                    <div className="carousel-inner ">
                        <div className="carousel-item active ">
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

                <div className="row mt-5">
                    <div className="col-sm mb-3">
                        <div className="form-outline text-center">
                            <label className="form-label text-success" htmlFor="textArea2">
                                <i className="bi bi-plus text-success fs-5"></i> čo sa Vám páčilo
                            </label>
                            <textarea
                                className={`form-control ${likedTextError ? 'is-invalid' : ''}`}
                                rows="5"
                                id="textArea2"
                                style={{ resize: 'none' }}
                                value={likedText}
                                onChange={handleLikedTextChange}
                            ></textarea>
                            {likedTextError && <div className="invalid-feedback">{likedTextError}</div>}
                        </div>
                    </div>
                    <div className="col-sm mb-3">
                        <div className="form-outline text-center">
                            <label className="form-label text-danger" htmlFor="textArea3">
                                <i className="bi bi-dash text-danger fs-5"></i> čo by sa malo zlepšiť
                            </label>
                            <textarea
                                className={`form-control ${improvementTextError ? 'is-invalid' : ''}`}
                                rows="5"
                                id="textArea3"
                                style={{ resize: 'none' }}
                                value={improvementText}
                                onChange={handleImprovementTextChange}
                            ></textarea>
                            {improvementTextError && <div className="invalid-feedback">{improvementTextError}</div>}
                        </div>
                    </div>
                </div>

                <hr />
                <div className='text-center'>
                    <h4>CELKOVÉ HODNOTENIE</h4>
                    <Rating
                        onClick={handleRating}
                        initialValue={ratingValue}
                    />
                    <h1>{ratingValue}/5</h1>
                    <div className={`alert alert-success align-self-center mx-auto mb-0 w-100 ${isAlertVisible ? 'visible' : 'd-none '}`} role="alert">
                        <span><i className="bi bi-check-circle-fill"></i> Úspešne ste ohodnotili vodiča.</span>
                    </div>
                    <div className={`alert alert-danger align-self-center mx-auto mb-0 w-100 ${isErrorAlertVisible ? 'visible' : 'd-none '}`} role="alert">
                        <span><i className="bi bi-x-circle-fill"></i> Pre zanechanie hodnotenia sa vyžaduje nastaviť minimálne "celkové hodnotenie".</span>
                    </div>
                </div>

            </Modal.Body>
            <Modal.Footer className="justify-content-center">
                <Button className='fs-5 rounded-pill' variant="primary" onClick={postReview}>
                    POTVRDIŤ
                </Button>
                <Button className='fs-5 rounded-pill' variant="outline-primary" onClick={handleClose}>
                    ZATVORIŤ
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
