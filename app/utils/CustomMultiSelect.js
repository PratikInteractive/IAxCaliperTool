import React, { useState } from "react";

const CustomMultiSelect = ({ options, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [isInvalid, setIsInvalid] = useState(false);

    const toggleDropdown = () => {
        setIsOpen((prev) => !prev);
    };

    const handleCheckboxChange = (option) => {
        const updatedOptions = selectedOptions.includes(option)
            ? selectedOptions.filter((item) => item !== option)
            : [...selectedOptions, option];

        setSelectedOptions(updatedOptions);
        onChange(updatedOptions);
        setIsInvalid(false);
    };

    const handleSelectAll = () => {
        if (selectedOptions.length === options.length) {
            setSelectedOptions([]); // Deselect all
            onChange([]); // Notify parent
        } else {
            setSelectedOptions(options); // Select all
            onChange(options); // Notify parent
        }
        setIsInvalid(false);
    };

    const handleBlur = () => {
        if (selectedOptions.length === 0) {
            setIsInvalid(true);
        }
    };

    return (
        <div className="customMultiSelect">
            <div
                className={`dropdownLabel ${isInvalid ? "invalid" : ""}`}
                onClick={toggleDropdown}
                onBlur={handleBlur}
                tabIndex={0}
            >
                {selectedOptions.length > 0
                    ? `Selected: ${selectedOptions.map((o) => o.label).join(", ")}`
                    : "Select from list"}
            </div>
            {isOpen && (
                <div className="dropdownList">
                    <label className="dropdownItem">
                        <input
                            type="checkbox"
                            checked={selectedOptions.length === options.length}
                            onChange={handleSelectAll}
                        />
                        Select All
                    </label>
                    {options.map((option, index) => (
                        <label key={index} className="dropdownItem">
                            <input
                                type="checkbox"
                                value={option.value}
                                checked={selectedOptions.includes(option)}
                                onChange={() => handleCheckboxChange(option)}
                            />
                            {option.label}
                        </label>
                    ))}
                </div>
            )}
            {isInvalid && <p className="error">This field is required.</p>}
        </div>
    );
};

export default CustomMultiSelect;
