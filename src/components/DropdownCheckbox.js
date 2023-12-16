import  React, { useState } from "react";
import "../styles/DropdownCheckbox.css";

//Translation
import { useTranslation } from "react-i18next";
// const [t, i18n] = useTranslation("global")
// shoppingList, listViewer, listEditor, navbar
// {t("location.access")}
//-----

const DropdownCheckbox = ({ options, onSelectionChange }) => {
    const [t] = useTranslation("global")
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState([]);

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
   
    return (
        <div className="dropdown-checkbox">
            <button onClick={toggleDropdown}>{t("listViewer.filterBtn")}</button>
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
