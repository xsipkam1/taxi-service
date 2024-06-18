import '../../styles/background.css'
import '../../styles/searchform.css'
import AddressAutofill from './AddressAutofill';
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import ResponseModal from '../../common/ResponseModal'

export default function SearchRideForm({ onSubmit, setSearchFormData, setDrivers }) {
    const userToken = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
    const [errorModalShow, setErrorModalShow] = useState(false);
    const [addressErrorModalShow, setAddressErrorModalShow] = useState(false);
    const datetimeRef = useRef(null);
    const [dateTime, setDateTime] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [fromAddress, setFromAddress] = useState({
        streetAndNumber: "",
        latitude: "",
        longitude: "",
    });
    const [toAddress, setToAddress] = useState({
        streetAndNumber: "",
        latitude: "",
        longitude: "",
    });

    const calculateDistance = async () => {
        try {
            const response = await axios.get(`https://api.mapbox.com/directions/v5/mapbox/driving/${fromAddress.longitude},${fromAddress.latitude};${toAddress.longitude},${toAddress.latitude}?geometries=geojson`, {
                params: {
                    access_token: import.meta.env.VITE_TOKEN,
                },
            });
            if (response && response.data.routes[0].distance && response.data.routes[0].duration) {
                return response;
            }
        } catch (error) {
            setErrorModalShow(true);
        }
    }

    const loadDrivers = async (dateTime, time, quantity) => {
        const data = {
            dateTime,
            time,
            quantity
        }
        const result = await axios.post("http://localhost:8080/customer/get-available-drivers", data, { headers: { Authorization: `Bearer ${userToken}` } }); 
        setDrivers(result.data);
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        if (fromAddress.streetAndNumber && fromAddress.latitude && fromAddress.longitude && toAddress.streetAndNumber && toAddress.latitude && toAddress.longitude) {
            const response = await calculateDistance();
            if (response) {
                const distanceKm = response.data.routes[0].distance / 1000;
                const timeHours = response.data.routes[0].duration / 3600;
                setSearchFormData({
                    from: fromAddress.streetAndNumber,
                    to: toAddress.streetAndNumber,
                    dateTime,
                    quantity,
                    route: response.data.routes[0].geometry,
                    fromCoordinates: { latitude: fromAddress.latitude, longitude: fromAddress.longitude },
                    toCoordinates: { latitude: toAddress.latitude, longitude: toAddress.longitude },
                    distance: distanceKm.toFixed(2),
                    time: timeHours
                });
                loadDrivers(dateTime, timeHours, quantity);
                onSubmit();
            }
        } else {
            setAddressErrorModalShow(true);
        }
    };

    const updateMinTime = () => {
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const yyyy = today.getFullYear();
        const hh = String(today.getHours()).padStart(2, '0');
        const m = String(today.getMinutes() + 5).padStart(2, '0');
        const formattedDate = `${yyyy}-${mm}-${dd}T${hh}:${m}`;
        datetimeRef.current.min = formattedDate;
    }

    useEffect(() => {
        updateMinTime();
        const intervalId = setInterval(updateMinTime, 60000);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <section className="background">
            <div className="container">
                <h1>Chceš sa zviesť ?</h1>
            </div>
            <form className="searchform container" onSubmit={handleFormSubmit}>
                <AddressAutofill setAddress={setFromAddress} placeholder={"Odkiaľ"} />

                <AddressAutofill setAddress={setToAddress} placeholder={"Kam"} />

                <div>
                    <input type="datetime-local" id="datetimePicker" ref={datetimeRef} className="form-control" onChange={(e) => setDateTime(e.target.value)} required />
                </div>

                <div>
                    <input type="number" min="1" className="form-control" placeholder="Cestujúci" onChange={(e) => setQuantity(parseInt(e.target.value, 10))} required />
                </div>

                <button type="submit" className="btn btn-primary fs-3">HĽADAŤ</button>
            </form>

            <ResponseModal
                show={errorModalShow}
                handleClose={() => { setErrorModalShow(false); }}
                title="CHYBA"
                message={`Nie je možné objednať si jazdu pre trasu ${fromAddress.streetAndNumber} - ${toAddress.streetAndNumber}.`}
            />

            <ResponseModal
                show={addressErrorModalShow}
                handleClose={() => { setAddressErrorModalShow(false); }}
                title="CHYBA"
                message={`Nevieme nájsť adresu, ktorú ste zadali.`}
            />
        </section>
    );
}
