import React, { useState } from "react";
import "../styles/ShoppingListViewer.css";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import DropdownCheckbox from "./DropdownCheckbox";

const ListViewer = ({ shoppingLists, username }) => {
    const [selectedFilters, setSelectedFilters] = useState(["Public", "My Lists"]);
    const currentUser = username;

    const handleFilterChange = (selectedOptions) => {
        // Handle the change here
        console.log(selectedOptions); // Selected options
    };

    // function to calculate the total number of items (quantity) in a shopping list
    const calculateTotalItems = (quantityObj) => {
        return Object.values(quantityObj).reduce((total, qty) => total + parseInt(qty, 10), 0);
    };

    // Dropdown options
    const options = [
        { value: 'public', label: 'Public' },
        { value: 'shared', label: 'Shared with Me' },
        { value: 'mine', label: 'My Lists' },
        { value: 'archived', label: 'Archived' }
    ];

    if (!Array.isArray(shoppingLists) || shoppingLists.length === 0) {
        return <div>No shopping lists available.</div>;
    }

    return (
        <div className="list-viewer">
            <div className="list-navbar">
                <div className="filter-text">
                    {selectedFilters.join(", ")} Shopping Lists
                </div>
                <div className="navbar-controls">
                    <DropdownCheckbox id="button" options={options} onSelectionChange={handleFilterChange} />
                    <Link to="/create"><button>Create Shopping List</button></Link>
                    <input type="text" placeholder="Search..." />
                </div>
            </div>
            <div className="list-tiles">
                {shoppingLists
                    .filter(list => list.owner === currentUser || list.sharedTo.includes(currentUser) || list.state === "public")
                    .map((list) => {
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
