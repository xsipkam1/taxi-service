import '../../styles/result.css'
import '../../styles/results.css'
import { useState, useEffect } from 'react';
import axios from '../../security/CrossOrigin'
import CustomerResult from './CustomerResult';

export default function Customers() {
    const userToken = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
    const [customers, setCustomers] = useState([]);
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

    const filteredCustomers = customers.filter((customer) => {
        const searchValue = searchQuery.toLowerCase();
        return (
            customer.fname.toLowerCase().includes(searchValue) ||
            customer.lname.toLowerCase().includes(searchValue) ||
            String(customer.telephone).includes(searchValue) ||
            String(formatDate(customer.registrationDate)).includes(searchValue) ||
            String(customer.ordersCount).includes(searchValue) ||
            String(customer.ordersWorth).includes(searchValue)
        );
    });

    switch (sortingOption) {
        case 1:
            filteredCustomers.sort((a, b) => a.fname.localeCompare(b.fname));
            break;
        case 2:
            filteredCustomers.sort((a, b) => b.fname.localeCompare(a.fname));
            break;
        case 3:
            break;
        case 4:
            filteredCustomers.reverse();
            break;
        case 5:
            filteredCustomers.sort((a, b) => a.ordersCount - b.ordersCount);
            break;
        case 6:
            filteredCustomers.sort((a, b) => b.ordersCount - a.ordersCount);
            break;
        case 7:
            filteredCustomers.sort((a, b) => a.ordersWorth - b.ordersWorth);
            break;
        case 8:
            filteredCustomers.sort((a, b) => b.ordersWorth - a.ordersWorth);
            break;
        default:
            break;
    }

    const loadCustomers = async () => {
        try {
            const result = await axios.get("/admin/customers", { headers: { Authorization: `Bearer ${userToken}` } });
            setCustomers(result.data);
        } catch (err) { }
    };

    useEffect(() => {
        loadCustomers();
    }, []);

    return (
        <>
            {customers.length === 0 ? (
                <section className='container-md d-flex flex-column align-items-center personal-profile'>
                    <h2 className="text-center">MOMENTÁLNE ŽIADNY ZÁKAZNÍCI</h2>
                </section>
            ) : (
                <section className='container-md d-flex flex-column align-items-center personal-profile'>
                    <div className="search-bar-container d-flex filter-options align-items-center">
                        <div className="search-bar me-3 w-100">
                            <input type="text" className="form-control" placeholder="Vyhľadať..." onChange={(e) => setSearchQuery(e.target.value)} />
                        </div>
                        <div className="dropdown w-100 d-flex">
                            <div className="input-group-text border-dark">Zoradiť:</div>
                            <select className="form-select" aria-label="Dropdown" onChange={handleSortingChange} value={sortingOption}>
                                <option value="1">Meno (vzostupne)</option>
                                <option value="2">Meno (zostupne)</option>
                                <option value="3">Dátum registrácie (vzostupne)</option>
                                <option value="4">Dátum registrácie (zostupne)</option>
                                <option value="5">Počet objednávok (vzostupne)</option>
                                <option value="6">Počet objednávok (zostupne)</option>
                                <option value="7">Total suma objednávok (vzostupne)</option>
                                <option value="8">Total suma objednávok (zostupne)</option>
                            </select>
                        </div>
                    </div>

                    {filteredCustomers.map((customer) => (
                        <CustomerResult
                            key={customer.id}
                            customer={customer}
                            reloadCustomers={loadCustomers}
                        />
                    ))}
                </section>
            )}
        </>
    );
}