import { Modal, Button } from 'react-bootstrap';
import { useState } from 'react';

export default function FilterDriversModal({ show, handleClose, text, lowestPrice, highestPrice, setMaxCost, setShowOrderModal }) {

    const [userMaxCost, setUserMaxCost] = useState(highestPrice);

    const handleSliderChange = (event) => {
        setUserMaxCost(parseFloat(event.target.value));
    };

    const handleConfirmButton = () => {
        setMaxCost(userMaxCost);
        handleClose();
        setShowOrderModal(true);
    }

    return (
        <Modal show={show} onHide={handleClose} centered className='modal-lg'>
            <Modal.Header className='text-center' closeButton>
                <Modal.Title className="fs-1 w-100">NASTAVTE MAXIMÁLNU CENU</Modal.Title>
            </Modal.Header>
            <Modal.Body className="fs-5 text-center">
                <p>
                    {text} <br /><br />
                </p>
                <label htmlFor="customRange1" className="form-label">Nastavte maximálnu sumu na 1km:</label>
                <div className="slider-container">
                    <input type="range" className="form-range" id="customRange1" min={lowestPrice} max={highestPrice} step="0.01" value={userMaxCost} onChange={handleSliderChange}></input>
                    <div className="slider-popup"><strong>{userMaxCost.toFixed(2)}€</strong></div>
                </div>
            </Modal.Body>
            <Modal.Footer className="mt-2 justify-content-center">
                <Button className='fs-5 rounded-pill' variant="primary" onClick={handleConfirmButton}>
                    POTVRDIŤ
                </Button>
                <Button className='fs-5 rounded-pill' variant="outline-primary" onClick={handleClose}>
                    ZATVORIŤ
                </Button>
            </Modal.Footer>
        </Modal>
    );
}