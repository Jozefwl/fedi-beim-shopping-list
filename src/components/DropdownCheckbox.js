import  React, { useState, useEffect } from "react";
import "../styles/DropdownCheckbox.css"; // Path to your CSS file

const DropdownCheckbox = ({ options, onSelectionChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const defaultSelectedOptions = ['public', 'mine']; // Default selected options
    const [selectedOptions, setSelectedOptions] = useState(defaultSelectedOptions);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleCheckboxChange = (optionValue) => {
        if (selectedOptions.includes(optionValue)) {
            setSelectedOptions(selectedOptions.filter(item => item !== optionValue));
        } else {
            setSelectedOptions([...selectedOptions, optionValue]);
        }
    };

    const handleApply = () => {
        onSelectionChange(selectedOptions);
        setIsOpen(false);
    };

    // Use Effect to ensure the default selection is communicated to the parent component
    useEffect(() => {
        onSelectionChange(defaultSelectedOptions);
    }, []); // Empty dependency array to run only on the component's first render
   
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
    );} 

export default DropdownCheckbox;
