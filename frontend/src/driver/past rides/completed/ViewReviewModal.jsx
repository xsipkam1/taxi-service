import { Modal, Button } from 'react-bootstrap';
import '../../../styles/profilemodal.css';
import '../../../styles/myprofile.css';
import '../../../styles/order.css';
import '../../../styles/review.css';
import user from '../../../assets/user.png';
import { Image } from "cloudinary-react"
import { useState } from 'react';

export default function LeaveReviewModal({ show, handleClose, order }) {
    const [imageLoadError, setImageLoadError] = useState(false);
    return (
        <Modal show={show} onHide={handleClose} centered className='modal-xl'>
            <Modal.Header className='text-center' closeButton>
                <Modal.Title className="fs-1 w-100">HODNOTENIE JAZDY</Modal.Title>
            </Modal.Header>
            <Modal.Body className="fs-5">
                <div className='d-flex justify-content-center mb-3 leave-review-title'>
                    <h3 className='m-0'>{`${order.customer.fname} ${order.customer.lname}`}</h3>
                </div>
                <div id="carouselExampleIndicators" className="carousel slide order-modal-profile-pic mx-auto leave-review-profile-pic">
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

                <div className="row mt-5">
                    <div className="col-sm mb-3">
                        <div className="form-outline text-center">
                            <label className="form-label text-success" htmlFor="textArea2">
                                <i className="bi bi-plus text-success fs-5"></i> čo sa zákazníkovi páčilo
                            </label>
                            <textarea readOnly
                                id="textArea2"
                                className="form-control"
                                rows="5"
                                style={{ resize: 'none' }}
                                value={order.review?.plus}
                            ></textarea>
                        </div>
                    </div>
                    <div className="col-sm mb-3">
                        <div className="form-outline text-center">
                            <label className="form-label text-danger" htmlFor="textArea3">
                                <i className="bi bi-dash text-danger fs-5"></i> čo by sa malo podľa zákazníka zlepšiť
                            </label>
                            <textarea readOnly
                                id="textArea3"
                                className="form-control"
                                rows="5"
                                style={{ resize: 'none' }}
                                value={order.review?.minus}
                            ></textarea>
                        </div>
                    </div>
                </div>

                <hr />
                <div className='text-center'>
                    <h4>CELKOVÉ HODNOTENIE</h4>
                    <h1>{order.review ? `${order.review.rating}/5` : "-/5"}</h1>
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
