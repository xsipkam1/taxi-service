import { Modal, Button } from 'react-bootstrap';
import { useState } from 'react';
import defaultAxios from "axios"

export default function UploadCarPictureModal({ show, handleClose, car, onError, pictureUploaded }) {

    const [imageSelected, setImageSelected] = useState();

    const validateFile = (event) => {
        const file = event.target.files[0];
        const fileSize = file.size / 1024 / 1024;
        const fileType = file.type;
        if (fileSize > 5) {
            event.target.value = "";
            return;
        }
        if (!["image/jpeg", "image/jpg", "image/png"].includes(fileType)) {
            event.target.value = "";
            return;
        }
        setImageSelected(event.target.files[0]);
    }

    const uploadImage = async () => {
        if (!imageSelected) return;
        const formData = new FormData();
        formData.append("file", imageSelected);
        formData.append("upload_preset", import.meta.env.VITE_CLOUD_PRESET);
        const result = await defaultAxios.post(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`, formData);
        if (result.status !== 200) {
            onError();
            return;
        }
        const url = `${result.data.url.split('/upload/')[0]}/upload/c_thumb,h_500,w_500/${result.data.url.split('/upload/')[1]}`;
        setImageSelected();
        pictureUploaded(url);
    }


    return (
        <Modal show={show} onHide={handleClose} centered className='modal-lg'>
            <Modal.Header className='text-center' closeButton>
                <Modal.Title className="fs-1 w-100">NAHRAJTE FOTKU</Modal.Title>
            </Modal.Header>
            <Modal.Body className="fs-5 text-center">
                Vozidlo {car.carName} s {car.carPassengers} miestom/ami doposiaľ nebolo pridelené žiadnemu vodičovi. Preto sa vyžaduje, aby ste nahrali fotografiu vozidla.
                <div className="mt-4">
                    <label htmlFor="formFile" className="form-label text-secondary">Nahrajte súbor - MAX veľkost 10MB, podporované formáty (jpg,png,jpeg)</label>
                    <input className="form-control border-dark" type="file" id="formFile" onChange={validateFile}/>
                </div>
            </Modal.Body>
            <Modal.Footer className="mt-2 justify-content-center">
                <Button className='fs-5' variant="primary" onClick={uploadImage}>
                    NAHRAŤ
                </Button>
                <Button className='fs-5' variant="outline-primary" onClick={handleClose}>
                    ZATVORIŤ
                </Button>
            </Modal.Footer>
        </Modal>
    );
}