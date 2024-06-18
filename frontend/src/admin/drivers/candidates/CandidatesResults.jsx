import { useState } from 'react';
import CandidateResult from './CandidateResult';

export default function CandidatesResults({ candidates, reloadCandidates }) {
    const [sortingOption, setSortingOption] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");

    const handleSortingChange = (event) => {
        const value = event.target.value;
        setSortingOption(parseInt(value, 10));
    };

    const filteredCandidates = candidates.filter((candidate) => {
        const searchValue = searchQuery.toLowerCase();
        return (
            candidate.fname.toLowerCase().includes(searchValue) ||
            candidate.lname.toLowerCase().includes(searchValue) ||
            candidate.email.toLowerCase().includes(searchValue) ||
            String(candidate.telephone).includes(searchValue)
        );
    });

    switch (sortingOption) {
        case 1:
            break;
        case 2:
            filteredCandidates.reverse();
            break;
        case 3:
            filteredCandidates.sort((a, b) => {
                const nameA = a.fname + a.lname;
                const nameB = b.fname + b.lname;

                return nameA.localeCompare(nameB);
            });
            break;
        case 4:
            filteredCandidates.sort((a, b) => {
                const nameA = a.fname + a.lname;
                const nameB = b.fname + b.lname;

                return nameB.localeCompare(nameA);
            });
            break;
        default:
            break;
    }

    return (
        <>
            {candidates.length === 0 ? (
                <h2 className="text-center">MOMENTÁLNE ŽIADNE ŽIADOSTI</h2>
            ) : (
                <>
                    <div className="search-bar-container d-flex filter-options align-items-center">
                        <div className="search-bar me-3 w-100">
                            <input type="text" className="form-control" placeholder="Vyhľadať..." onChange={(e) => setSearchQuery(e.target.value)} />
                        </div>
                        <div className="dropdown w-100 d-flex">
                            <div className="input-group-text border-dark">Zoradiť:</div>
                            <select className="form-select" aria-label="Dropdown" onChange={handleSortingChange} value={sortingOption}>
                                <option value="1">Dátum podania žiadosti (vzostupne)</option>
                                <option value="2">Dátum podania žiadosti (zostupne)</option>
                                <option value="3">Meno (vzostupne)</option>
                                <option value="4">Meno (zostupne)</option>
                            </select>
                        </div>
                    </div>

                    <table className="table border shadow table-striped fs-5 text-center">
                        <thead>
                            <tr className='first-row'>
                                <th scope="col">Číslo</th>
                                <th scope="col">Meno</th>
                                <th scope="col">Priezvisko</th>
                                <th scope="col">Email</th>
                                <th scope="col">Tel.č.</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCandidates.map((candidate, index) => (
                                <CandidateResult
                                    key={candidate.id}
                                    index={index}
                                    candidate={candidate}
                                    reloadCandidates={reloadCandidates}
                                />
                            ))}
                        </tbody>
                    </table> 
                </>
            )}

        </>
    );
}
