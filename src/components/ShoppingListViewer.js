import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/ShoppingListViewer.css";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import DropdownCheckbox from "./DropdownCheckbox";
import { jwtDecode } from 'jwt-decode';
import { useTranslation } from "react-i18next";

const ListViewer = ({ token }) => {
    const [t] = useTranslation("global")
    const [shoppingLists, setShoppingLists] = useState(['public']);
    const [selectedFilters, setSelectedFilters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null);
    const [usernames, setUsernames] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const appTheme = localStorage.getItem("appTheme") || "dark";
    const selectedTheme = appTheme === 'dark' ? '' : '-light';


    useEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUserId(decoded.userId);
                setSelectedFilters(['mine']);
            } catch (error) {
                console.error('Error decoding token:', error);
                setUserId(null);
                setSelectedFilters(['public']);
            }
        } else {
            setUserId(null);
            setSelectedFilters(['public']);
        }
    }, [token]);

    useEffect(() => {
        const fetchLists = async () => {
            setLoading(true);
            try {
                const publicListsResponse = await axios.post('http://194.182.91.65:3000/getAllPublicLists');
                let allLists = publicListsResponse.data;

                if (userId) {
                    const config = { headers: { Authorization: `Bearer ${token}` } };
                    const myListsResponse = await axios.get('http://194.182.91.65:3000/getMyLists', config);
                    allLists = [...allLists, ...myListsResponse.data];
                }

                // Remove potential duplicates
                const uniqueLists = Array.from(new Map(allLists.map(list => [list['_id'], list])).values());

                setShoppingLists(uniqueLists);
            } catch (error) {
                console.error('Error fetching lists', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLists();
    }, [userId, token]);

    useEffect(() => {
        const fetchUsernames = async (ownerIds) => {
            try {
                const response = await axios.post('http://194.182.91.65:3000/getUsernames', {
                    userIds: ownerIds  // Send the ownerIds array in the body
                }, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setUsernames(response.data); // Update the usernames state
            } catch (error) {
                console.error('Error fetching usernames', error);
            }
        };

        const fetchLists = async () => {
            setLoading(true);
            try {
                const publicListsResponse = await axios.post('http://194.182.91.65:3000/getAllPublicLists');
                let allLists = publicListsResponse.data;

                if (userId) {
                    const config = { headers: { Authorization: `Bearer ${token}` } };
                    const myListsResponse = await axios.get('http://194.182.91.65:3000/getMyLists', config);
                    allLists = [...allLists, ...myListsResponse.data];
                }

                const uniqueLists = Array.from(new Map(allLists.map(list => [list['_id'], list])).values());
                setShoppingLists(uniqueLists);

                // Extract unique owner IDs and fetch usernames
                const ownerIds = [...new Set(uniqueLists.map(list => list.ownerId))];
                if (ownerIds.length > 0) {
                    fetchUsernames(ownerIds);
                }
            } catch (error) {
                console.error('Error fetching lists', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLists();
    }, [userId, token]);

    const calculateTotalItems = (items) => {
        if (!Array.isArray(items)) {
            console.error('Invalid items array:', items);
            return 0; // Return 0 if items is not an array
        }

        return items.reduce((total, item) => {
            if (typeof item.quantity === 'number') {
                return total + item.quantity;
            } else {
                console.error('Invalid item quantity:', item);
                return total;
            }
        }, 0);
    };

    const options = [
        { value: 'public', label: t("listViewer.public") },
        { value: 'shared', label: t("listViewer.shared") },
        { value: 'mine', label: t("listViewer.mine") },
        { value: 'archived', label: t("listViewer.archived") }
    ];

    if (loading) {
        return <div>{t("listViewer.loadingLists")}</div>
    }

    if (!Array.isArray(shoppingLists) || shoppingLists.length === 0) {
        return <div>{t("errors.listsUnavailable")}</div>;
    }

    const handleFilterChange = (selectedOptions) => {
        setSelectedFilters(selectedOptions);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredShoppingLists = () => {
        return shoppingLists.filter(list => {
            const isPublic = selectedFilters.includes('public') && list.isPublic;
            const isMine = selectedFilters.includes('mine') && list.ownerId === userId;
            const isSharedWithMe = selectedFilters.includes('shared') && list.sharedTo.includes(userId);
            const isArchived = selectedFilters.includes('archived') && list.isArchived;

            // Make list 
            if (isArchived) {
                return list.isArchived;
            }

            // Searching logic
            const matchesSearchQuery = list.shoppingListName.toLowerCase().includes(searchQuery.toLowerCase());

            return (isPublic || isMine || isSharedWithMe) && matchesSearchQuery && !list.isArchived;
        });
    };

    const getFilterLabels = (filterValues) => {
        return filterValues.map(value =>
            options.find(option => option.value === value)?.label || value
        );
    };

    return (
        <div className={`list-viewer${selectedTheme}`}>
            <div className={`list-navbar${selectedTheme}`}>
                <div className="filter-text">
                    {getFilterLabels(selectedFilters).join(", ")} {t("listViewer.shoppingLists")}
                </div>
                <div className="navbar-controls">
                    <DropdownCheckbox options={options} onSelectionChange={handleFilterChange} />
                    <Link to="/create/true" className="navbar-btn"><button>{t("listViewer.newList")}</button></Link>
                </div>
            </div>
            <div className="search-bar">
                        <input className="searchbar-input" type="text" placeholder={t("listViewer.search")} onChange={handleSearchChange} />
                    </div>
            <div className="list-tiles">
                {filteredShoppingLists().map((list) => {
                    const totalItems = calculateTotalItems(list.items);
                    const firstCategory = list.items && list.items.length > 0 ? list.items[0].category : 'N/A';
                    const firstTwoItems = list.items ? list.items.slice(0, 2) : [];

                    return (
                        <div key={list._id} className={`list-tile${selectedTheme}`}>
                            <div className="tile-header">
                                <span className="list-name">{list.shoppingListName}</span>
                                <span className="item-count">{totalItems} {t("listViewer.items")}</span>
                            </div>
                            <div className="list-preview">
                                <p>{t("shoppingList.itemCtg")}: {t("shoppingList.categories."+firstCategory)}</p>
                                <ul>
                                    {firstTwoItems.map((item, index) => (
                                        <li key={item.id || index}>{item.name}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="list-owner">
                            {t("listViewer.ownedBy")} {usernames[list.ownerId] || "Loading..."}
                            </div>
                            <Link to={"/shoppinglist/" + list._id}><Button className={`view-button${selectedTheme}`}>{t("listViewer.viewBtn")}</Button></Link>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ListViewer;
