import '../../styles/results.css';
import DriversResults from './drivers/DriversResults';
import CarsResults from './cars/CarsResults';
import { useState } from 'react';

export default function SearchRideResults({searchFormData, drivers}) {      //searchFormData budes potrebovat pri OrderModal.jsx aby bolo pri zhrnuti objednavky vidno vsetko co si user objednal 

    const [selectedButton, setSelectedButton] = useState('VODIČI');

    const handleButtonClick = (button) => {
        setSelectedButton(button);
    };

    return (
        <section id="searchResults" className="container-md d-flex flex-column align-items-center results">
            <div className="btn-group p-3 buttons-on-top">
                <button
                    className={`btn btn-primary m-0 fs-2 btn-lg rounded-left ${selectedButton === 'VODIČI' ? 'active' : 'inactive'}`}
                    onClick={() => handleButtonClick('VODIČI')}>
                    VODIČI
                </button>
                <button
                    className={`btn btn-outline-primary m-0 fs-2 btn-lg rounded-right ${selectedButton === 'AUTÁ' ? 'active' : ''}`}
                    onClick={() => handleButtonClick('AUTÁ')}>
                    AUTÁ
                </button>
            </div>

            {selectedButton === 'VODIČI' && <DriversResults searchFormData={searchFormData} drivers={drivers}/>}
            {selectedButton === 'AUTÁ' && <CarsResults searchFormData={searchFormData} drivers={drivers}/>} 
        </section>
    );
}
