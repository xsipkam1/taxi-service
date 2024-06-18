import '../../styles/result.css'
import '../../styles/results.css'
import '../../styles/table.css'
import { useState, useEffect } from 'react';
import DriversResults from "./active/DriversResults"
import CandidatesResults from './candidates/CandidatesResults'
import axios from "../../security/CrossOrigin";

export default function Drivers() {
    const userToken = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
    const [drivers, setDrivers] = useState([]);
    const [candidates, setCandidates] = useState([]);
    const [selectedButton, setSelectedButton] = useState('AKTUÁLNY');

    const handleButtonClick = (button) => {
        setSelectedButton(button);
    };

    const loadCandidates = async () => {
        try {
            const result = await axios.get("/admin/candidates", { headers: { Authorization: `Bearer ${userToken}` } });
            setCandidates(result.data);
        } catch (err) {}
    };

    const loadDrivers = async () => {
        try {
            const result = await axios.get("/admin/drivers", { headers: { Authorization: `Bearer ${userToken}` } });
            setDrivers(result.data);
        } catch (err) {}
    };

    useEffect(() => {
        loadDrivers();
        loadCandidates();
    }, []);

    const reload = async () => {
        loadCandidates();
        loadDrivers();
    }

    return (
        <section className='container-md d-flex flex-column align-items-center personal-profile'>
            <div className="btn-group p-3 buttons-on-top">
                <button
                    className={`btn btn-primary m-0 fs-2 btn-lg rounded-left ${selectedButton === 'AKTUÁLNY' ? 'active' : 'inactive'}`}
                    onClick={() => handleButtonClick('AKTUÁLNY')}>
                    AKTUÁLNY
                </button>
                <button
                    className={`btn btn-outline-primary m-0 fs-2 btn-lg rounded-right ${selectedButton === 'UCHÁDZAČI' ? 'active' : ''}`}
                    onClick={() => handleButtonClick('UCHÁDZAČI')}>
                    UCHÁDZAČI
                </button>
            </div>

            {selectedButton === 'AKTUÁLNY' && <DriversResults drivers={drivers} reloadDrivers={reload}/>}
            {selectedButton === 'UCHÁDZAČI' && <CandidatesResults candidates={candidates} reloadCandidates={reload}/>}

        </section>
    );
}