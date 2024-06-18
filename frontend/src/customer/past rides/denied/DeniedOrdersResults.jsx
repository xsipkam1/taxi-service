import DeniedOrderResult from './DeniedOrderResult'
import { useState } from 'react';

export default function DeniedOrdersResults({ orders, reload }) {

    const ordersList = orders.slice();

    const [sortingOption, setSortingOption] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");

    const handleSortingChange = (event) => {
        const value = event.target.value;
        setSortingOption(parseInt(value, 10));
    };

    const filteredOrders = ordersList.filter((order) => {
        const searchValue = searchQuery.toLowerCase();
        const driverMatches = order.deniedDrivers.some(driver => 
            driver.fname?.toLowerCase().includes(searchValue) ||
            driver.lname?.toLowerCase().includes(searchValue) ||
            String((driver.cost * order.distance).toFixed(2)).includes(searchValue) ||
            driver.car?.name?.toLowerCase().includes(searchValue)
        );

        const fromOrToMatch = order.from.toLowerCase().includes(searchValue) ||
                              order.to.toLowerCase().includes(searchValue);

        return driverMatches || fromOrToMatch;
    });

    switch (sortingOption) {
        case 1:
            filteredOrders.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
            break;
        case 2:
            filteredOrders.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));
            break;
        default:
            break;
    }

    return (
        <>
            {orders.length === 0 ? (
                <h2 className="text-center">MOMENTÁLNE ŽIADNE ZAMIETNUTÉ JAZDY</h2>
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
                            </select>
                        </div>
                    </div>

                    {filteredOrders.map((order) => (
                        <DeniedOrderResult key={order.id} order={order} reload={reload}/>
                    ))}
                </>
            )}
        </>
    );
}