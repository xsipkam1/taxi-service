import user from '../assets/user.png';
import '../styles/review.css';
import { Image } from "cloudinary-react"
import { useState } from 'react';

export default function Review({ review }) {

    const [imageLoadError, setImageLoadError] = useState(false);

    return (
        <div className='container d-flex review p-2 shadow mb-2'>
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
    );
}