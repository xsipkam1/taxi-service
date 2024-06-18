import { useState, useEffect } from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import axios from "../../security/CrossOrigin"
import CompletedOrderResult from './completed/CompletedOrderResult';
import DeniedOrderResult from './denied/DeniedOrderResult';
import DriverOrdersResults from '../common/DriverOrdersResults';

export default function PastRides() {
    const userToken = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
    const [selectedButton, setSelectedButton] = useState('DOKONČENÉ');
    const [deniedOrders, setDeniedOrders] = useState([]);
    const [completedOrders, setCompletedOrders] = useState([]);

    const handleButtonClick = (button) => {
        setSelectedButton(button);
    };

    const loadPastOrders = async () => {
        const result = await axios.get("/driver/past-orders", { headers: { Authorization: `Bearer ${userToken}` } });
        setDeniedOrders(result.data.deniedOrders);
        setCompletedOrders(result.data.completedOrders);
    };

    useEffect(() => {
        loadPastOrders();
    }, []);

    const completedTooltip = (props) => (
        <Tooltip {...props}>
            V sekcii DOKONČENÉ sa zhromažďujú jazdy, ktoré ste už odjazdili.
        </Tooltip>
    );

    const deniedTooltip = (props) => (
        <Tooltip {...props}>
            V sekcii ZAMIETNUTÉ sa zhromažďujú jazdy, ktoré ste zamietli, alebo nepotvrdili včas.
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

            {selectedButton === 'DOKONČENÉ' && <DriverOrdersResults orders={completedOrders} textEmpty="MOMENTÁLNE ŽIADNE DOKONČENÉ JAZDY" resultComponent={CompletedOrderResult} reload={loadPastOrders}/>}
            {selectedButton === 'ZAMIETNUTÉ' && <DriverOrdersResults orders={deniedOrders} textEmpty="MOMENTÁLNE ŽIADNE ZAMIETNUTÉ OBJEDNÁVKY" resultComponent={DeniedOrderResult} reload={loadPastOrders}/>}

        </section>
    );
}
