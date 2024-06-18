import user from '../../../assets/user.png';
import '../../../styles/review.css';
import { useState } from 'react';
import axios from '../../../security/CrossOrigin.jsx'
import { Image } from "cloudinary-react"

export default function ManageReview({ review, reload }) {
    const userToken = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [imageLoadError, setImageLoadError] = useState(false);

    const handleDeleteReview = () => {
        setShowConfirmation(true);
    };

    const handleConfirmDelete = async () => {
        const result = await axios.delete(`/admin/delete-review/${review.id}`, { headers: { Authorization: `Bearer ${userToken}` } });
        setShowConfirmation(false);
        reload();
    };

    const handleCancelDelete = () => {
        setShowConfirmation(false);
    };

    return (
        <div className="review shadow mb-2">
            <div className='container d-flex p-2 m-1'>
                <div className="d-flex review-one-line-details">
                    <div className="review-profile-pic">
                        {review.profilePicUrl && !imageLoadError ? (
                            <Image
                                cloudName={import.meta.env.VITE_CLOUD_PRESET}
                                publicId={review.profilePicUrl}
                                onError={() => setImageLoadError(true)}
                            />
                        ) : (
                            <img src={user} alt="user profile pic" />
                        )}
                    </div>
                    <div className="review-details">
                        <h2>{`${review.fname} ${review.lname}`}</h2>
                        <p>
                            <i className="bi bi-plus text-success fs-1"></i>
                            {`${review.plus.trim() !== '' ? review.plus : 'nič'}`}
                        </p>
                        <hr className='m-0' />
                        <p>
                            <i className="bi bi-dash text-danger fs-1"></i>
                            {`${review.minus.trim() !== '' ? review.minus : 'nič'}`}
                        </p>
                    </div>
                    <div className="score d-flex flex-column">
                        <h1>{`${review.rating}/5`}</h1>
                    </div>
                </div>

            </div>
            {showConfirmation ? (
                <div className='d-flex flex-column justify-content-center align-items-center mt-1 mb-4'>
                    <div className='mb-2 text-center'>Naozaj chcete recenziu odstrániť?</div>
                    <div>
                        <button type="button" className="btn btn-outline-danger m-0 me-2" onClick={handleConfirmDelete}>ÁNO</button>
                        <button type="button" className="btn btn-outline-primary m-0" onClick={handleCancelDelete}>NIE</button>
                    </div>
                </div>
            ) : (
                <div className='d-flex justify-content-center align-items-center mt-1 mb-4'>
                    <button type="button" className="btn btn-outline-danger m-0" onClick={handleDeleteReview}>VYMAZAŤ RECENZIU</button>
                </div>
            )}
        </div>
    );
}