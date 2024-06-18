import DriverResult from './DriverResult.jsx';
import { useState } from 'react';

export default function DriversResults({searchFormData, drivers}) {
    const driversList = drivers.slice();
    
    const [sortingOption, setSortingOption] = useState(1); 
    const [searchQuery, setSearchQuery] = useState("");

    const handleSortingChange = (event) => {
        const value = event.target.value;
        setSortingOption(parseInt(value, 10));
    };

    const filteredDrivers = driversList.filter((driver) => {
        const searchValue = searchQuery.toLowerCase();
        return (
            driver.fname.toLowerCase().includes(searchValue) ||
            driver.lname.toLowerCase().includes(searchValue) ||
            driver.car.name.toLowerCase().includes(searchValue) ||
            String(driver.cost).includes(searchValue) ||
            String(driver.ranking).includes(searchValue) ||
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
            filteredDrivers.sort((a, b) => a.ranking - b.ranking);
            break;
        case 6:
            filteredDrivers.sort((a, b) => b.ranking - a.ranking);
            break;
        case 7:
            filteredDrivers.sort((a, b) => a.ridesCompleted - b.ridesCompleted);
            break;
        case 8:
            filteredDrivers.sort((a, b) => b.ridesCompleted - a.ridesCompleted);
            break;
        default:
            break;
    }

    return (
        <>
           <div className="search-bar-container d-flex filter-options align-items-center">
                <div className="search-bar me-3 w-100 mb-3">
                    <input type="text" className="form-control m-0" placeholder="Vyhľadať..." onChange={(e) => setSearchQuery(e.target.value)}/>
                </div>
                <div className="dropdown w-100 d-flex m-0 mb-3">
                    <div className="input-group-text border-dark">Zoradiť:</div>
                    <select className="form-select" aria-label="Dropdown" onChange={handleSortingChange} value={sortingOption}>
                        <option value="1">Meno (vzostupne)</option>
                        <option value="2">Meno (zostupne)</option>
                        <option value="3">Cena/km (vzostupne)</option>
                        <option value="4">Cena/km (zostupne)</option>
                        <option value="5">Hodnotenie (vzostupne)</option>
                        <option value="6">Hodnotenie (zostupne)</option>
                        <option value="7">Dokončené jazdy (vzostupne)</option>
                        <option value="8">Dokončené jazdy (zostupne)</option>
                    </select>
                </div>
            </div>
            
            {filteredDrivers.map((driver) => (
                <DriverResult
                    key={driver.id}
                    driver={driver}
                    searchFormData={searchFormData}
                />
            ))}
        </>
    );
}
