import  React, { useState } from 'react';
import '../styles/DropdownCheckbox.css'; // Path to your CSS file

const DropdownCheckbox = ({ options, onSelectionChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState([]);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleCheckboxChange = (option) => {
        if (selectedOptions.includes(option)) {
            setSelectedOptions(selectedOptions.filter(item => item !== option));
        } else {
            setSelectedOptions([...selectedOptions, option]);
        }
    };

    const handleApply = () => {
        onSelectionChange(selectedOptions);
        setIsOpen(false);
    };

    return (
        <div className="dropdown-checkbox">
            <button onClick={toggleDropdown}>Filter</button>
            {isOpen && (
                <div className="dropdown-content">
                    {options.map(option => (
                        <label key={option.value}>
                            <input
                                type="checkbox"
                                checked={selectedOptions.includes(option.value)}
                                onChange={() => handleCheckboxChange(option.value)}
                            />
                            {option.label}
                        </label>
                    ))}
                    <button onClick={handleApply}>Apply</button>
                </div>
            )}
        </div>
    );
};

export default DropdownCheckbox;