import React, { useState, useEffect } from "react";
import "../styles/ShoppingListViewer.css";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import DropdownCheckbox from "./DropdownCheckbox";

const ListViewer = ({ shoppingLists, username }) => {
    const initialFilters = username ? ['public', 'mine'] : ['public'];
    const [selectedFilters, setSelectedFilters] = useState(initialFilters);
    const currentUser = username;

    useEffect(() => {
        setSelectedFilters(username ? ['mine'] : ['public']);
    }, [username]); // Depend on username

    const calculateTotalItems = (quantityObj) => {
        return Object.values(quantityObj).reduce((total, qty) => total + parseInt(qty, 10), 0);
    };

    const options = [
        { value: 'public', label: 'Public' },
        { value: 'shared', label: 'Shared with Me' },
        { value: 'mine', label: 'My Lists' },
        { value: 'archived', label: 'Archived' }
    ];

    if (!Array.isArray(shoppingLists) || shoppingLists.length === 0) {
        return <div>No shopping lists available.</div>;
    }

    const handleFilterChange = (selectedOptions) => {
        setSelectedFilters(selectedOptions);
    };

    const filteredShoppingLists = () => {
        return shoppingLists.filter(list => {
            if (!username && list.state !== "public") {
                // If not logged in, only show public lists
                return false;
            }

            const isPublic = list.state === "public";
            const isMine = list.owner === username;
            const isShared = list.sharedTo.includes(username);
            const isArchived = list.state === "archived"; // Example

            return (selectedFilters.includes('public') && isPublic) ||
                   (selectedFilters.includes('mine') && isMine) ||
                   (selectedFilters.includes('shared') && isShared) ||
                   (selectedFilters.includes('archived') && isArchived);
        });
    };


    const getFilterLabels = (filterValues) => {
        return filterValues.map(value =>
            options.find(option => option.value === value)?.label || value
        );
    };

    return (
        <div className="list-viewer">
            <div className="list-navbar">
                <div className="filter-text">
                    {getFilterLabels(selectedFilters).join(", ")} Shopping Lists
                </div>
                <div className="navbar-controls">
                    <DropdownCheckbox options={options} onSelectionChange={handleFilterChange} />
                    <Link to="/create/true"><button>Create Shopping List</button></Link>
                    <input type="text" placeholder="Search..." />
                </div>
            </div>
            <div className="list-tiles">
                {filteredShoppingLists().map((list) => {
                    const totalItems = calculateTotalItems(list.quantity);
                    const firstCategory = Object.values(list.category)[0];
                    const firstTwoItems = Object.entries(list.name).slice(0, 2).map(([id, name]) => ({ id, name }));

                    return (
                        <div key={list.id} className="list-tile">
                            <div className="tile-header">
                                <span className="list-name">{list.shoppingListName}</span>
                                <span className="item-count">{totalItems} items</span>
                            </div>
                            <div className="list-preview">
                                <p>Category: {firstCategory}</p>
                                <ul>
                                    {firstTwoItems.map((item) => (
                                        <li key={item.id}>{item.name}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="list-owner">
                                Owned by: {list.owner}
                            </div>
                            <Link to={"/shoppinglist/" + list.id}><Button className="view-button">View</Button></Link>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ListViewer;
