import { Modal, Button } from 'react-bootstrap';
import '../../styles/profilemodal.css';

export default function SearchInfoModal({ show, handleClose, onChooseSelf, onQuickRide, searchFormData, numOfDrivers }) {

    const handleChooseSelf = () => {
        handleClose(); 
        onChooseSelf(); //v NewRide nastavi userChoseSelf = true
    };

    const handleQuickRideClick = () => {
        handleClose();
        onQuickRide(); 
    };

    if (numOfDrivers > 1) {
        return (
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header className='text-center' closeButton>
                    <Modal.Title className="fs-1 w-100">Dobré správy!</Modal.Title>
                </Modal.Header>
                <Modal.Body className="fs-5 text-center">
                    <p className='mb-0'>{`Pre trasu`} <strong>{`${searchFormData.from}`}</strong> {`-`} <strong>{`${searchFormData.to}`}</strong> {`sme našli`} <strong>{`${numOfDrivers}`}</strong> {`dostupných vodičov. Chcete si vybrať zo zoznamu dostupných vodičov/vozidiel alebo potrebujete rýchly odvoz bez potreby výberu?`}</p>
                </Modal.Body>
                <Modal.Footer className="justify-content-center">
                    <Button className='modal-button rounded-pill' variant="primary" onClick={handleChooseSelf}>
                        VYBRAŤ SÁM
                    </Button>
                    <Button className='modal-button rounded-pill' variant="outline-primary" onClick={handleQuickRideClick}>
                        RÝCHLA JAZDA
                    </Button> 
                </Modal.Footer>
            </Modal>
        );
    } else if (numOfDrivers == 1) {
        return (
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header className='text-center' closeButton>
                    <Modal.Title className="fs-1 w-100">Dobré správy!</Modal.Title>
                </Modal.Header>
                <Modal.Body className="fs-5 text-center">
                    <p className='mb-0'>{`Pre trasu`} <strong>{`${searchFormData.from}`}</strong> {`-`} <strong>{`${searchFormData.to}`}</strong> {`sme našli`} <strong>{`${numOfDrivers}`}</strong> {`jedného dostupného vodiča`}</p>
                </Modal.Body>
                <Modal.Footer className="justify-content-center">
                    <Button className='modal-button rounded-pill' variant="outline-primary" onClick={handleQuickRideClick}>
                        OK
                    </Button> 
                </Modal.Footer>
            </Modal>
        );
    }
    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header className='text-center' closeButton>
                <Modal.Title className="fs-1 w-100">Je nám to ľúto</Modal.Title>
            </Modal.Header>
            <Modal.Body className="fs-5 text-center">
                <p className='mb-0'>{`Pre trasu`} <strong>{`${searchFormData.from}`}</strong> {`-`} <strong>{`${searchFormData.to}`}</strong> {`sme nenašli žiadnych dostupných vodičov.`}</p>
            </Modal.Body>
            <Modal.Footer className="justify-content-center">
                <Button className='fs-5 rounded-pill' variant="outline-primary" onClick={handleClose} style={{ width: '35%' }}>
                    ZATVORIŤ
                </Button> 
            </Modal.Footer>
        </Modal>
    );
    
}