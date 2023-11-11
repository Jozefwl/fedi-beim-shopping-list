// Importing necessary React hooks and components
import React, { useState, useContext } from "react";
import { useParams } from "react-router-dom";
import shoppinglists from "../data/shoppinglists.json";
import "../styles/ShoppingList.css";
import "../styles/Table.css";
import UserContext from "../components/UserContext";

// ParentComponent function component
const ParentComponent = () => {
  // Extracting parameters from the URL
  const params = useParams();
  // Retrieving shopping list data based on the provided ID
  const shoppingList = shoppinglists[params.shoppingListId];
  // Extracting relevant information from the shopping list data
  const shoppingListPublic = shoppingList.public;
  const shoppingListOwner = shoppingList.owner;

  // Rendering the ShoppingList component with necessary props
  return <ShoppingList id={params.shoppingListId} shoppingListPublic={shoppingListPublic} shoppingListOwner={shoppingListOwner} />;
};

// Table function component
const Table = ({ id }) => {
  // Retrieving shopping list data based on the provided ID
  const shoppingList = shoppinglists[id];
  // Extracting the shopping list name
  const shoppingListName = shoppingList.shoppingListName;

  // Extracting items from the shopping list data
  const items = Object.keys(shoppingList["name"]).map((key) => ({
    id: key,
    name: shoppingList["name"][key],
    category: shoppingList["category"][key],
    quantity: shoppingList["quantity"][key],
  }));

  // State hooks for managing visibility, checked items, and filter
  const [visibleCategories, setVisibleCategories] = useState([items[0].category]);
  const [checkedItems, setCheckedItems] = useState(
    items.reduce((acc, item) => {
      acc[item.id] = false;
      return acc;
    }, {})
  );
  const [filter, setFilter] = useState("unchecked");

  // Function to toggle visibility of a category
  const toggleCategoryVisibility = (category) => {
    if (visibleCategories.includes(category)) {
      setVisibleCategories(visibleCategories.filter((c) => c !== category));
    } else {
      setVisibleCategories([...visibleCategories, category]);
    }
  };

  // Event handler for checkbox changes
  const handleCheckboxChange = (event) => {
    const itemId = event.target.value;
    const isChecked = event.target.checked;
    setCheckedItems({ ...checkedItems, [itemId]: isChecked });
  };

  // Event handler for filter changes
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  // Function to render table rows based on categories and filters
  const renderTableRows = () => {
    const categories = [...new Set(items.map((item) => item.category))];
    const filteredItems = filter === "checked"
      ? items.filter((item) => checkedItems[item.id])
      : items.filter((item) => !checkedItems[item.id]);

    return categories.map((category, index) => (
      <React.Fragment key={index}>
        <tr>
          <td className="category-cell">
            Category: {category} ({filteredItems.filter((item) => item.category === category).length})
          </td>
          <td className="expand-cell">
            <button
              className={`expand-button ${visibleCategories.includes(category) ? "expanded" : ""}`}
              onClick={() => toggleCategoryVisibility(category)}
            >
              {visibleCategories.includes(category) ? "▼" : "►"} Expand
            </button>
          </td>
        </tr>
        {visibleCategories.includes(category) && (
          <React.Fragment>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Quantity</th>
            </tr>
            {filteredItems
              .filter((item) => item.category === category)
              .map((item, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="checkbox"
                      value={item.id}
                      checked={checkedItems[item.id]}
                      onChange={handleCheckboxChange}
                      className="checkbox"
                    />
                  </td>
                  <td>{item.name}</td>
                  <td>
                    {item.quantity} {item.quantity === 1 ? "piece" : "pieces"}
                  </td>
                </tr>
              ))}
          </React.Fragment>
        )}
      </React.Fragment>
    ));
  };

  // Rendering the table header, buttons, and the table itself
  return (
    <>
      <div className="table-header">
        <div className="header-content">
          <div className="tableName">
            <p className="table-header-text">{shoppingListName}</p>
          </div>
          <div className="header-buttons">
            <a href="edit"><button className="table-header-button">Edit</button></a>
            <div className="filter-dropdown-wrapper">
              <label htmlFor="filterDropdown">Show: </label>
              <select className="table-header-dropdown" id="filterDropdown" onChange={handleFilterChange} value={filter}>
                <option value="unchecked">Unchecked</option>
                <option value="checked">Checked</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <table className="table">
        <tbody>{renderTableRows()}</tbody>
      </table>
    </>
  );
};

// ShoppingList function component
const ShoppingList = (props) => {
  // Using the useContext hook to access the username from the UserContext
  const username = useContext(UserContext);

  // Conditional rendering based on whether the shopping list is public or if the user is the owner
  if (props.shoppingListPublic === true || username === props.shoppingListOwner) {
    return (
      <div>
        {/* Rendering the Table component with the provided props */}
        <Table id={props.id} />
      </div>
    );
  } else {
    return (
      <div className="unauthorized">
        You are not authorized to view this shopping list.
      </div>
    );
  }
};

// Exporting the ParentComponent as the default export
export default ParentComponent;
