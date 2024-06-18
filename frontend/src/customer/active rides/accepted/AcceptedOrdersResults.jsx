import AcceptedOrderResult from './AcceptedOrderResult';
import { useState } from 'react';

export default function AcceptedOrdersResults({ orders }) {

    const ordersList = orders.slice();

    const [sortingOption, setSortingOption] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");

    const handleSortingChange = (event) => {
        const value = event.target.value;
        setSortingOption(parseInt(value, 10));
    };

    const filteredOrders = ordersList.filter((order) => {
        const searchValue = searchQuery.toLowerCase();
        return (
            order.from.toLowerCase().includes(searchValue) ||
            order.to.toLowerCase().includes(searchValue) ||
            order.drivers[0].fname.toLowerCase().includes(searchValue) ||
            order.drivers[0].lname.toLowerCase().includes(searchValue) ||
            order.drivers[0].car.name.toLowerCase().includes(searchValue)
        )
    });

    switch (sortingOption) {
        case 1:
            filteredOrders.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
            break;
        case 2:
            filteredOrders.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));
            break;
        case 3:
            filteredOrders.sort((a, b) => b.drivers[0].cost * b.distance - a.drivers[0].cost * a.distance);
            break;
        case 4:
            filteredOrders.sort((a, b) => a.drivers[0].cost * a.distance - b.drivers[0].cost * b.distance);
            break;
        default:
            break;
    }

    return (
        <>
            {orders.length === 0 ? (
                <h2 className="text-center">MOMENTÁLNE ŽIADNE POTVRDENÉ OBJEDNÁVKY</h2>
            ) : (
                <>
                    <div className="search-bar-container d-flex filter-options align-items-center">
                        <div className="search-bar me-3 w-100 mb-3">
                            <input type="text" className="form-control m-0" placeholder="Vyhľadať..." onChange={(e) => setSearchQuery(e.target.value)} />
                        </div>
                        <div className="dropdown w-100 d-flex m-0 mb-3">
                            <div className="input-group-text border-dark">Zoradiť:</div>
                            <select className="form-select" aria-label="Dropdown" onChange={handleSortingChange} value={sortingOption}>
                                <option value="1">Dátum (vzostupne)</option>
                                <option value="2">Dátum (zostupne)</option>
                                <option value="3">Cena (vzostupne)</option>
                                <option value="4">Cena (zostupne)</option>
                            </select>
                        </div>
                    </div>

                    {filteredOrders.map((order) => (
                        <AcceptedOrderResult key={order.id} order={order} />
                    ))}
                </>
            )}
        </>
    );
}