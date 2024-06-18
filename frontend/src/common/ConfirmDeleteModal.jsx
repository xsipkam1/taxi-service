import { Modal, Button } from 'react-bootstrap';

export default function ConfirmDeleteModal({ show, handleClose, handleConfirm, message }) {

    return (
        <Modal show={show} onHide={handleClose} centered className='modal-lg'>
            <Modal.Header className='text-center' closeButton>
                <Modal.Title className="fs-1 w-100">POTVRĎTE ODSTRÁNENIE</Modal.Title>
            </Modal.Header>
            <Modal.Body className="fs-5 text-center">
                {message}
            </Modal.Body>
            <Modal.Footer className="mt-2 justify-content-center">
                <Button className='fs-5' variant="outline-danger rounded-pill" onClick={handleConfirm}>
                    ODSTRÁNIŤ
                </Button>
                <Button className='fs-5' variant="outline-primary rounded-pill" onClick={handleClose}>
                    ZATVORIŤ
                </Button>
            </Modal.Footer>
        </Modal>
    );
}