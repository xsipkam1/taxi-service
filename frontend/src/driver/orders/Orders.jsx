import { useState, useEffect } from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import PendingOrderResult from '../orders/pending/PendingOrderResult';
import DriverOrdersResults from '../common/DriverOrdersResults';
import AcceptedOrderResult from '../orders/accepted/AcceptedOrderResult';
import '../../styles/results.css';
import '../../styles/result.css';
import '../../styles/myprofile.css';
import axios from '../../security/CrossOrigin'

export default function Orders() {
    const userToken = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
    const [selectedButton, setSelectedButton] = useState('ŽIADOSTI');
    const [pendingOrders, setPendingOrders] = useState([]);
    const [acceptedOrders, setAcceptedOrders] = useState([]);

    const handleButtonClick = (button) => {
        setSelectedButton(button);
    };

    const loadActiveOrders = async () => {
        const result = await axios.get("/driver/active-orders", { headers: { Authorization: `Bearer ${userToken}` } });
        setPendingOrders(result.data.pendingOrders);
        setAcceptedOrders(result.data.acceptedOrders);
    };


    useEffect(() => {
        loadActiveOrders();
    }, []);

    const pendingTooltip = (props) => (
        <Tooltip {...props}>
            V sekcii ŽIADOSTI sa zhromažďujú žiadosti od zákazníkov o jazdu. Po potvrdení sa presunú do sekcie PRIJATÉ.
        </Tooltip>
    );

    const acceptedTooltip = (props) => (
        <Tooltip {...props}>
            V sekcii PRIJATÉ sa zhromažďujú jazdy, ktoré ste potvrdili, ale ešte neodjazdili - tieto jazdy sú nadchádzajúce a vykonajú sa.
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
                        className={`btn btn-primary m-0 fs-2 btn-lg rounded-left ${selectedButton === 'ŽIADOSTI' ? 'active' : 'inactive'}`}
                        onClick={() => handleButtonClick('ŽIADOSTI')}>
                        ŽIADOSTI
                    </button>
                </OverlayTrigger>

                <OverlayTrigger
                    placement="bottom"
                    delay={{ show: 1000, hide: 200 }}
                    overlay={acceptedTooltip}>
                    <button
                        className={`btn btn-outline-primary m-0 fs-2 btn-lg rounded-right ${selectedButton === 'PRIJATÉ' ? 'active' : ''}`}
                        onClick={() => handleButtonClick('PRIJATÉ')}>
                        PRIJATÉ
                    </button>
                </OverlayTrigger>
            </div>

            {selectedButton === 'ŽIADOSTI' && <DriverOrdersResults orders={pendingOrders} textEmpty="MOMENTÁLNE ŽIADNE ŽIADOSTI O JAZDU" resultComponent={PendingOrderResult} reload={loadActiveOrders}/>}
            {selectedButton === 'PRIJATÉ' && <DriverOrdersResults orders={acceptedOrders} textEmpty="MOMENTÁLNE ŽIADNE POTVRDENÉ OBJEDNÁVKY" resultComponent={AcceptedOrderResult} reload={loadActiveOrders}/>}

        </section>
    );
}
