import { useState, useEffect } from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import CompletedOrdersResults from './completed/CompletedOrdersResults';
import DeniedOrdersResults from './denied/DeniedOrdersResults';
import axios from "../../security/CrossOrigin";

export default function PastRides() {
    const userToken = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
    const [selectedButton, setSelectedButton] = useState('DOKONČENÉ');
    const [deniedOrders, setDeniedOrders] = useState([]);
    const [completedOrders, setCompletedOrders] = useState([]);

    const handleButtonClick = (button) => {
        setSelectedButton(button);
    };

    const loadPastOrders = async () => {
        const result = await axios.get("/customer/past-orders", { headers: { Authorization: `Bearer ${userToken}` } });
        setDeniedOrders(result.data.deniedOrders);
        setCompletedOrders(result.data.completedOrders);
    };

    useEffect(() => {
        loadPastOrders();
    }, []);

    const completedTooltip = (props) => (
        <Tooltip {...props}>
            V sekcii DOKONČENÉ sa zhromažďujú jazdy, ktoré sa už vykonali.
        </Tooltip>
    );

    const deniedTooltip = (props) => (
        <Tooltip {...props}>
            V sekcii ZAMIETNUTÉ sa zhromažďujú jazdy, ktoré vodiči zamietli, alebo nepotvrdili včas.
        </Tooltip>
    );

    return (
        <section className='container-md d-flex flex-column align-items-center personal-profile'>
            <div className="btn-group p-3 buttons-on-top">
                <OverlayTrigger
                    placement="bottom"
                    delay={{ show: 1000, hide: 200 }}
                    overlay={completedTooltip}>
                    <button
                        className={`btn btn-primary m-0 fs-2 btn-lg rounded-left ${selectedButton === 'DOKONČENÉ' ? 'active' : 'inactive'}`}
                        onClick={() => handleButtonClick('DOKONČENÉ')}>
                        DOKONČENÉ
                    </button>
                </OverlayTrigger>

                <OverlayTrigger
                    placement="bottom"
                    delay={{ show: 1000, hide: 200 }}
                    overlay={deniedTooltip}>
                    <button
                        className={`btn btn-outline-primary m-0 fs-2 btn-lg rounded-right ${selectedButton === 'ZAMIETNUTÉ' ? 'active' : ''}`}
                        onClick={() => handleButtonClick('ZAMIETNUTÉ')}>
                        ZAMIETNUTÉ
                    </button>
                </OverlayTrigger>
            </div>

            {selectedButton === 'DOKONČENÉ' && <CompletedOrdersResults orders={completedOrders}/>}
            {selectedButton === 'ZAMIETNUTÉ' && <DeniedOrdersResults orders={deniedOrders} reload={loadPastOrders}/>}

        </section>
    );
}

//pri ZAMIETNUTYCH -> v pripade quick ride alebo objednavky auta sa presunie takato objednavka do zamietnutych ak ju nestihol ani 1 vodic vcas potvrdit alebo ju vsetci odmietli
//DOKONCENE maju taky isty format ako accepted - rozdiel je, ze cas jazdy uz je z minulosti 

/*
tu sa musia rendrovat aj CarResult-y nie len DriverResult-y
customer bude mat tieto Order listy:
    pending - daju sa zrusit
    accepted - vykonaju sa
    denied - zamietnute vodicom
    completed - uspesne dokoncene

driver bude mat tieto Order listy:
    pending - cakaju na prijatie / zamietnutie
    accepted - nadchadzajuce
    denied - zamietnute
    completed - dokoncene


1.) ked customer objednava 1 vodica:
    ->customer: append to PENDING
    ->vodic: append to PENDING

    ak customer zrusi objednavku:
        ->customer: remove from PENDING
        ->vodic: remove from PENDING
    ak vodic objednavku zamietne alebo neprijime / nestihne prijat 
        -> customer: append to DENIED + remove from pending
        -> vodic: append to DENIED + remove from pending
    ak vodic objednavku prijime vcas
        -> customer: append to ACCEPTED + remove from pending
        -> vodic: append to ACCEPTED + remove from pending
    ak vodic objednavku prijal a uz sa jazda vykonala
        -> customer: append to COMPLETED + remove from accepted
        -> vodic: append to COMPLETED + remove from accepted

2.) ked customer objednava viac ako 1 vodica (quick ride / car order):
    ->customer: append to PENDING
    ->vodici: append to PENDING

    ak customer zrusi objednavku:
        ->customer: remove from PENDING
        ->vodici: remove from PENDING
    ak ziaden z vodicov do stanoveneho casu objednavku neprijime alebo ju kazdy zamietne:
        -> customer: append to DENIED + remove from pending
        -> vodici: append to DENIED + remove from pending
    ak napr 1 vodic objednavku zamietne ale dalsi 5 vodici este ani nezamietli ani nepotvrdili:
        ->vodic: append to DENIED + remove from pending (ak uz ziaden vodic v PENDING liste nema objednavku s tymto id -> pripad vyssie)
    ak 1 vodic objednavku prijime:
        -> customer: append to ACCEPTED + remove from pending
        -> vodic: append to ACCEPTED + remove from pending
        -> ostatni vodici: append to DENIED (napisat ze nestihli potvrdit) + remove from pending
    ak 1 vodic objednavku prijal a uz sa vykonala:
        -> customer: append to COMPLETED + remove from accepted
        -> vodic: append to COMPLETED + remove from accepted
*/