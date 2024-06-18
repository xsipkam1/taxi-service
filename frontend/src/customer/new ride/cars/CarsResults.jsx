import { useState } from 'react';
import CarResult from './CarResult.jsx';

export default function CarsResults({ searchFormData, drivers }) {  //nikde ne-fetchujes cars.json, ten je iba na ukazku ako to na pozadi vyzera, ty menis len drivers.json aby mal tvar ako cars.json
    const driversList = drivers.slice();

    const cars = driversList.reduce((acc, driver) => {
        const existingCar = acc.find((car) => car.id === driver.car.id);

        if (existingCar) {
            existingCar.drivers.push({
                id: driver.id,
                fname: driver.fname,
                lname: driver.lname,
                cost: driver.cost,
                profilePicUrl: driver.profilePicUrl,
                ranking: driver.ranking,
                ridesCompleted: driver.ridesCompleted,
                reviews: driver.reviews,
                hireDate: driver.hireDate,
                telephone: driver.telephone,
            });
        } else {
            acc.push({
                id: driver.car.id,
                name: driver.car.name,
                passengers: driver.car.passengers,
                carPictureUrl: driver.car.carPictureUrl,
                drivers: [{
                    id: driver.id,
                    fname: driver.fname,
                    lname: driver.lname,
                    cost: driver.cost,
                    profilePicUrl: driver.profilePicUrl,
                    ranking: driver.ranking,
                    ridesCompleted: driver.ridesCompleted,
                    reviews: driver.reviews,
                    hireDate: driver.hireDate,
                    telephone: driver.telephone,
                }],
            });
        }

        return acc;
    }, []);

    const [sortingOption, setSortingOption] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSortingChange = (event) => {
        setSortingOption(parseInt(event.target.value, 10));
    };

    const filteredCars = cars.filter((car) => {
        const searchValue = searchQuery.toLowerCase();
        return (
            car.name.toLowerCase().includes(searchValue) ||
            String(car.passengers).includes(searchValue) ||
            String(car.drivers.length).includes(searchValue) ||
            String(Math.min(...car.drivers.map((driver) => driver.cost))).includes(searchValue) ||
            String(Math.max(...car.drivers.map((driver) => driver.cost))).includes(searchValue)
        );
    });

    switch (sortingOption) {
        case 1:
            filteredCars.sort((a, b) => Math.min(...a.drivers.map((driver) => driver.cost)) - Math.min(...b.drivers.map((driver) => driver.cost)));
            break;
        case 2:
            filteredCars.sort((a, b) => Math.min(...b.drivers.map((driver) => driver.cost)) - Math.min(...a.drivers.map((driver) => driver.cost)));
            break;
        case 3:
            filteredCars.sort((a, b) => Math.max(...a.drivers.map((driver) => driver.cost)) - Math.max(...b.drivers.map((driver) => driver.cost)));
            break;
        case 4:
            filteredCars.sort((a, b) => Math.max(...b.drivers.map((driver) => driver.cost)) - Math.max(...a.drivers.map((driver) => driver.cost)));
            break;
        case 5:
            filteredCars.sort((a, b) => a.drivers.length - b.drivers.length);
            break;
        case 6:
            filteredCars.sort((a, b) => b.drivers.length - a.drivers.length);
            break;
        case 7:
            filteredCars.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 8:
            filteredCars.sort((a, b) => b.name.localeCompare(a.name));
            break;
        case 9:
            filteredCars.sort((a, b) => a.passengers - b.passengers);
            break;
        case 10:
            filteredCars.sort((a, b) => b.passengers - a.passengers);
            break;
        default:
            break;
    }

    return (
        <>
            <div className="search-bar-container d-flex filter-options align-items-center">
                <div className="search-bar me-3 w-100 mb-3">
                    <input type="text" className="form-control m-0" placeholder="Vyhľadať..." onChange={(e) => setSearchQuery(e.target.value)} />
                </div>
                <div className="dropdown w-100 d-flex m-0 mb-3">
                    <div className="input-group-text border-dark">Zoradiť:</div>
                    <select className="form-select" aria-label="Dropdown" onChange={handleSortingChange} value={sortingOption}>
                        <option value="1">Najmenšia cena/km (vzostupne)</option>
                        <option value="2">Najmenšia cena/km (zostupne)</option>
                        <option value="3">Najväčšia cena/km (vzostupne)</option>
                        <option value="4">Najväčšia cena/km (zostupne)</option>
                        <option value="5">Počet vodičov (vzostupne)</option>
                        <option value="6">Počet vodičov (zostupne)</option>
                        <option value="7">Názov (vzostupne)</option>
                        <option value="8">Názov (zostupne)</option>
                        <option value="9">Miesta pre pasažierov (vzostupne)</option>
                        <option value="10">Miesta pre pasažierov (zostupne)</option>
                    </select>
                </div>
            </div>

            {filteredCars.map((car) => (
                <CarResult
                    key={car.id}
                    car={car}
                    searchFormData={searchFormData}
                    drivers={drivers}
                />
            ))}
        </>
    );
}
