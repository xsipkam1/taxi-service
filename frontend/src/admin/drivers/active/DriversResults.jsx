import { useState } from 'react';
import '../../../styles/results.css'
import DriverResult from './DriverResult';

export default function DriversResults({drivers, reloadDrivers}) {

    const [sortingOption, setSortingOption] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");

    const handleSortingChange = (event) => {
        const value = event.target.value;
        setSortingOption(parseInt(value, 10));
    };

    const formatDate = (date) => {
        const dateTime = new Date(date);
        const day = dateTime.getDate();
        const month = dateTime.getMonth() + 1;
        const year = dateTime.getFullYear();
        return `${day}. ${month}. ${year}`;
    };

    const filteredDrivers = drivers.filter((driver) => {
        const searchValue = searchQuery.toLowerCase();
        return (
            driver.fname.toLowerCase().includes(searchValue) ||
            driver.lname.toLowerCase().includes(searchValue) ||
            driver.carName.toLowerCase().includes(searchValue) ||
            String(driver.cost).includes(searchValue) ||
            String(formatDate(driver.hireDate)).includes(searchValue) ||
            String(driver.ridesCompleted).includes(searchValue)
        );
    });

    switch (sortingOption) {
        case 1:
            filteredDrivers.sort((a, b) => a.fname.localeCompare(b.fname));
            break;
        case 2:
            filteredDrivers.sort((a, b) => b.fname.localeCompare(a.fname));
            break;
        case 3:
            filteredDrivers.sort((a, b) => a.cost - b.cost);
            break;
        case 4:
            filteredDrivers.sort((a, b) => b.cost - a.cost);
            break;
        case 5:
            filteredDrivers.sort((a, b) => a.ridesCompleted - b.ridesCompleted);
            break;
        case 6:
            filteredDrivers.sort((a, b) => b.ridesCompleted - a.ridesCompleted);
            break;
        case 7:
            break;
        case 8:
            filteredDrivers.reverse();
            break;
        default:
            break;
    }

    return (
        <>
            {drivers.length === 0 ? (
                <h2 className="text-center">MOMENTÁLNE ŽIADNY VODIČI</h2>
            ) : (
                <>
                    <div className="search-bar-container d-flex filter-options align-items-center">
                        <div className="search-bar me-3 w-100">
                            <input type="text" className="form-control" placeholder="Vyhľadať..." onChange={(e) => setSearchQuery(e.target.value)} />
                        </div>
                        <div className="dropdown w-100 d-flex">
                            <div className="input-group-text border-dark">Zoradiť:</div>
                            <select className="form-select" aria-label="Dropdown" onChange={handleSortingChange} value={sortingOption}>
                                <option value="1">Meno (vzostupne)</option>
                                <option value="2">Meno (zostupne)</option>
                                <option value="3">Cena/km (vzostupne)</option>
                                <option value="4">Cena/km (zostupne)</option>
                                <option value="5">Počet dokončených jázd (vzostupne)</option>
                                <option value="6">Počet dokončených jázd (zostupne)</option>
                                <option value="7">Dátum najatia (vzostupne)</option>
                                <option value="8">Dátum najatia (zostupne)</option>
                            </select>
                        </div>
                    </div>

                    {filteredDrivers.map((driver) => (
                        <DriverResult
                            key={driver.id}
                            driver={driver}
                            reloadDrivers={reloadDrivers}
                        />
                    ))}
                </>
            )}
        </>
    );
}
