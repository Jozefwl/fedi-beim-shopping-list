import React, { useState, useEffect } from "react";
import { handeLogin, handleRegister } from "../components/UserContext";
import axios from "axios";
import "../styles/ShoppingListViewer.css";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import DropdownCheckbox from "./DropdownCheckbox";
import { jwtDecode } from 'jwt-decode';
import { useTranslation } from "react-i18next";
import { ArcElement, Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
Chart.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


const ListViewer = ({ token }) => {
    const [t] = useTranslation("global");
    const [shoppingLists, setShoppingLists] = useState(['public']);
    const [selectedFilters, setSelectedFilters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null);
    const [usernames, setUsernames] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const appTheme = localStorage.getItem("appTheme") || "dark";
    const selectedTheme = appTheme === 'dark' ? '' : '-light';
    const [publicItemsCount, setPublicItemsCount] = useState(0);

    const [barChartData, setBarChartData] = useState({
        labels: ["", ""],
        datasets: [
            {
                label: `${t("listViewer.countsGraph")}`,
                data: [0, 0],
                backgroundColor: ['#2f8a0e','#c91414'],
                borderColor: ['#2f8a0e','#c91414'],
                borderWidth: 1
            }
        ]
    });



    const [pieChartData, setPieChartData] = useState({
        labels: [t("listViewer.totalListsGraph"), t("listViewer.myListsGraph")],
        datasets: [
            {
                data: [0, 0],
                backgroundColor: ['#967a15', '#ffc800'],
                borderColor: ['#967a15', '#ffc800'],
                borderWidth: 1
            }
        ]
    });


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
        const fetchTotalLists = async () => {
            try {
                const response = await axios.get('http://194.182.91.65:3000/');
                const totalLists = response.data.shoppingListCount;

                setPieChartData(prevData => ({
                    ...prevData,
                    datasets: [{ ...prevData.datasets[0], data: [totalLists, prevData.datasets[0].data[1]] }]
                }));
            } catch (error) {
                console.error('Error fetching total lists:', error);
            }
        };

        fetchTotalLists();
    }, []);

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

                // Calculate the total number of items in public lists
                let publicItemsCount = allLists.reduce((total, list) => total + calculateTotalItems(list.items), 0);


                // Update bar chart data with public lists count and items count
                const translatedLabels = [
                    t("listViewer.numberOfListsGraph"),
                    t("listViewer.numberOfItemsGraph")
                ];

                setBarChartData(prevData => ({
                    ...prevData,
                    labels: translatedLabels,
                    datasets: [
                        {
                            ...prevData.datasets[0],
                            data: [allLists.length, publicItemsCount],
                        }
                    ]
                }));

                let myListsCount = 0;
                let myItemsCount = 0;

                if (userId) {
                    const config = { headers: { Authorization: `Bearer ${token}` } };
                    const myListsResponse = await axios.get('http://194.182.91.65:3000/getMyLists', config);
                    const myLists = myListsResponse.data.filter(list => !list.sharedTo.includes(userId));
                    allLists = [...allLists, ...myListsResponse.data];
                    myListsCount = myLists.length;

                    // Calculate the total number of items in my lists
                    myItemsCount = myLists.reduce((total, list) => total + calculateTotalItems(list.items), 0);

                    setBarChartData(prevData => ({
                        ...prevData,
                        datasets: [
                            {
                                ...prevData.datasets[0],
                                data: [myListsCount, myItemsCount]
                            }
                        ]
                    }));

                    setPieChartData(prevData => ({
                        ...prevData,
                        datasets: [{ ...prevData.datasets[0], data: [prevData.datasets[0].data[0], myListsCount] }]
                    }));
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
    }, [userId, token, t]);

    // Reset the bar chart and pie chart data when the language changes
    useEffect(() => {
        setBarChartData(prevData => ({
            ...prevData,
            labels: [t("listViewer.numberOfListsGraph"), t("listViewer.numberOfItemsGraph")]
        }));

        setPieChartData(prevData => ({
            ...prevData,
            labels: [t("listViewer.totalListsGraph"), t("listViewer.myListsGraph")]
        }));
    }, [t]);

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
            <div className="graphs-container">
                <div className="pie-chart">
                    <Pie data={pieChartData} />
                </div>
                <div className="bar-graph">
                    <Bar data={barChartData} />
                </div>
            </div>
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
                                <p>{t("shoppingList.itemCtg")}: {t("shoppingList.categories." + firstCategory)}</p>
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
