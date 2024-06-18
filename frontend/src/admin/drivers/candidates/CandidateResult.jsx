import '../../../styles/result.css';
import { useState } from 'react';
import CreateDriverModal from './CreateDriverModal';
import axios from "../../../security/CrossOrigin";
import ConfirmDeleteModal from '../../../common/ConfirmDeleteModal';
import ResponseModal from '../../../common/ResponseModal';

export default function CandidateResult({ index, candidate, reloadCandidates }) {
    const [showCreateDriverModal, setShowCreateDriverModal] = useState(false);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [responseModalShow, setResponseModalShow] = useState(false);
    const [errorResponseModalShow, setErrorResponseModalShow] = useState(false);

    const handleApproveCandidate = () => {
        setShowCreateDriverModal(true);
    };

    const handleCloseCreateDriverModal = () => {
        setShowCreateDriverModal(false);
    };

    const handleRejectCandidate = () => {
        setShowConfirmationModal(true);
    };

    const handleConfirmReject = async () => {
        setShowConfirmationModal(false);

        const userToken = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
        const result = await axios.delete(`/admin/reject-candidate/${candidate.id}`, { headers: { Authorization: `Bearer ${userToken}` } });
        if(result?.status === 200) {
            setResponseModalShow(true);
        } else {
            setErrorResponseModalShow(true);
        }

    };

    const handleCancelReject = () => {
        setShowConfirmationModal(false);
    };

    return (
        <tr className='other-row'>
            <th className='no'>{index + 1}</th>
            <td>{candidate.fname}</td>
            <td>{candidate.lname}</td>
            <td>{candidate.email}</td>
            <td>{candidate.telephone}</td>
            <td>
                <button className="btn btn-outline-danger mx-2 rounded-pill" onClick={handleRejectCandidate}>ZAMIETNUŤ</button>
                <button className="btn btn-outline-primary mx-2 rounded-pill" onClick={handleApproveCandidate}>SCHVÁLIŤ</button>
            </td>

            <CreateDriverModal
                show={showCreateDriverModal}
                handleClose={handleCloseCreateDriverModal}
                candidate={candidate}
                reloadCandidates={reloadCandidates}
            />

            <ConfirmDeleteModal
                show={showConfirmationModal}
                handleClose={handleCancelReject}
                handleConfirm={handleConfirmReject}
                message={`Po potvrdení zamietnutia kliknutím na tlačidlo ODSTRÁNIŤ sa natrvalo odstráni žiadosť kandidáta ${candidate.fname} ${candidate.lname} zo zoznamu bez možnosti obnovenia. Naozaj chcete odstrániť žiadosť?`}
            />

            <ResponseModal
                show={responseModalShow}
                handleClose={() => { setResponseModalShow(false); reloadCandidates(); }}
                title="ÚSPEŠNE ZAMIETNUTÉ"
                message={`Úspešne ste zamietli žiadosť kandidáta ${candidate.fname} ${candidate.lname}.`}
            />

            <ResponseModal
                show={errorResponseModalShow}
                handleClose={() => { setErrorResponseModalShow(false); }}
                title="CHYBA"
                message={`Pri zamietnutí žiadosti pre kandidáta ${candidate.fname} ${candidate.lname} nastala chyba.`}
            />

        </tr>
    );
}
