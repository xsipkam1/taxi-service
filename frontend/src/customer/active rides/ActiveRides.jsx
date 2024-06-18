import { useState, useEffect } from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import PendingOrdersResults from './pending/PendingOrdersResults';
import AcceptedOrdersResults from './accepted/AcceptedOrdersResults';
import axios from "../../security/CrossOrigin";

export default function ActiveRides() {
    const userToken = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
    const [selectedButton, setSelectedButton] = useState('ČAKAJÚCE');
    const [pendingOrders, setPendingOrders] = useState([]);
    const [acceptedOrders, setAcceptedOrders] = useState([]);

    const handleButtonClick = (button) => {
        setSelectedButton(button);
    };

    const loadActiveOrders = async () => {
        const result = await axios.get("/customer/active-orders", { headers: { Authorization: `Bearer ${userToken}` } });
        setPendingOrders(result.data.pendingOrders);
        setAcceptedOrders(result.data.acceptedOrders);
    };

    useEffect(() => {
        loadActiveOrders();
    }, []);

    const pendingTooltip = (props) => (
        <Tooltip {...props}>
            V sekcii ČAKAJÚCE sa zhromažďujú jazdy, pri ktorých sa čaká na potvrdenie vodičom - po potvrdení sa presunú do sekcie POTVRDENÉ.
        </Tooltip>
    );

    const acceptedTooltip = (props) => (
        <Tooltip {...props}>
            V sekcii POTVRDENÉ sa zhromažďujú jazdy, ktoré vodiči potvrdili, ale ešte neodjazdili - tieto jazdy sú nadchádzajúce a vykonajú sa.
        </Tooltip>
    );

    return (
        <section className='container-md d-flex flex-column align-items-center personal-profile'>
            <div className="btn-group p-3 buttons-on-top">
                <OverlayTrigger
                    placement="bottom"
                    delay={{ show: 1000, hide: 200 }}
                    overlay={pendingTooltip}>
                    <button
                        className={`btn btn-primary m-0 fs-2 btn-lg rounded-left ${selectedButton === 'ČAKAJÚCE' ? 'active' : 'inactive'}`}
                        onClick={() => handleButtonClick('ČAKAJÚCE')}>
                        ČAKAJÚCE
                    </button>
                </OverlayTrigger>

                <OverlayTrigger
                    placement="bottom"
                    delay={{ show: 1000, hide: 200 }}
                    overlay={acceptedTooltip}>
                    <button
                        className={`btn btn-outline-primary m-0 fs-2 btn-lg rounded-right ${selectedButton === 'POTVRDENÉ' ? 'active' : ''}`}
                        onClick={() => handleButtonClick('POTVRDENÉ')}>
                        POTVRDENÉ
                    </button>
                </OverlayTrigger>
            </div>

            {selectedButton === 'ČAKAJÚCE' && <PendingOrdersResults orders={pendingOrders} reload={loadActiveOrders}/>}
            {selectedButton === 'POTVRDENÉ' && <AcceptedOrdersResults orders={acceptedOrders} />}

        </section>
    );
}
