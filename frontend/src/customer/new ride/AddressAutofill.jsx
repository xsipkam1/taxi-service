import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export default function AddressAutofill({ setAddress, placeholder }) {
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(true);
    const [inputValue, setInputValue] = useState('');
    const inputRef = useRef();

    const handleChange = (event) => {
        setInputValue(event.target.value);
        handleInputChange(event.target.value);
    };

    const handleInputChange = async (query) => {
        const suggestions = await getPlaces(query);
        setSuggestions(suggestions);
        handleManualInputChange(suggestions);
    };

    const handleSuggestionClick = (suggestion) => {
        setInputValue(suggestion.place_name);
        {/*setFullAddressName(suggestion.place_name);*/}

        const address = {
            streetAndNumber: suggestion.place_name.split(",")[0],
            latitude: suggestion.center[1],
            longitude: suggestion.center[0],
        };

        if (suggestion.context) {
            suggestion.context.forEach((element) => {
                const identifier = element.id.split(".")[0];
                address[identifier] = element.text;
            });
        }

        setAddress(address);
        setSuggestions([]);
    };

    const handleClickOutside = (event) => {
        if (inputRef.current && !inputRef.current.contains(event.target)) {
            setShowSuggestions(false);
        } else {
            setShowSuggestions(true);
        }
    };

    const handleClickInside = () => {
        setShowSuggestions(true);
    };

    useEffect(() => {
        const inputElement = inputRef.current;
        if (inputElement) {
            document.addEventListener('mousedown', handleClickOutside);
            inputElement.addEventListener('mousedown', handleClickInside);
            
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
                inputElement.removeEventListener('mousedown', handleClickInside);
            };
        }
        return undefined;
    }, [inputRef]);

    const getPlaces = async (query) => {
        try {
            const response = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json`, {
                params: {
                    access_token: import.meta.env.VITE_TOKEN,
                },
            });
            return response.data.features;
        } catch (error) {
            console.error(error);
        }
    };

    const handleManualInputChange = (suggestions) => {
        if (suggestions[0]) {
            const address = {
                streetAndNumber: suggestions[0].place_name.split(",")[0],
                latitude: suggestions[0].center[1],
                longitude: suggestions[0].center[0],
            };

            if (suggestions[0].context) {
                suggestions[0].context.forEach((element) => {
                    const identifier = element.id.split(".")[0];
                    address[identifier] = element.text;
                });
            }

            setAddress(address);
            {/*setFullAddressName(suggestions[0].place_name);*/}
        } else {
            resetAddress();
        }
    }

    const resetAddress = () => {
        setAddress({
            streetAndNumber: "",
            latitude: "",
            longitude: "",
        })
    }

    return (
        <div ref={inputRef}>
            <input
                type="text"
                className='form-control'
                placeholder={placeholder}
                value={inputValue}
                onChange={handleChange}
                required
            />
            {showSuggestions && (
                <ul className="list-group suggestions">
                    {suggestions?.map((suggestion, index) => (
                        <li
                            className="list-group-item list-group-item-action"
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                        >
                            {suggestion.place_name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
