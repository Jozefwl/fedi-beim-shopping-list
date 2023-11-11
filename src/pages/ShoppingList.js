import React, { useState } from "react";
import { useParams } from "react-router-dom";
import shoppingLists from "../data/shoppinglists.json";
import "../styles/ShoppingList.css";
import shoppinglists from "../data/shoppinglists.json";
import "../styles/Table.css";

const ParentComponent = () => {
  const params = useParams();
  const shoppingList = shoppingLists[params.shoppingListId];
  const shoppingListPublic = shoppingLists[params.shoppingListId].public;
  const username = "asdf"; // replace with the actual username

  if (shoppingList.owner === username || shoppingListPublic === true) {
    return <ShoppingList id={params.shoppingListId} username={username} />;
  } else {
    return (
      <div className="unauthorized">
        You are not authorized to view this shopping list.
      </div>
    );
  }
};

const Table = ({ id }) => {
  const shoppingList = shoppinglists[id];
  const shoppingListName = shoppinglists[id].shoppingListName;


  const items = Object.keys(shoppingList["name"]).map((key) => ({
    id: key,
    name: shoppingList["name"][key],
    category: shoppingList["category"][key],
    quantity: shoppingList["quantity"][key],
  }));


  const [visibleCategories, setVisibleCategories] = useState([
    [...new Set(items.map((item) => item.category))][0],
  ]);

  const [checkedItems, setCheckedItems] = useState(
    items.reduce((acc, item) => {
      acc[item.id] = false;
      return acc;
    }, {})
  );

  const [filter, setFilter] = useState("unchecked");

  const toggleCategoryVisibility = (category) => {
    if (visibleCategories.includes(category)) {
      setVisibleCategories(visibleCategories.filter((c) => c !== category));
    } else {
      setVisibleCategories([...visibleCategories, category]);
    }
  };

  const handleCheckboxChange = (event) => {
    const itemId = event.target.value;
    const isChecked = event.target.checked;
    setCheckedItems({ ...checkedItems, [itemId]: isChecked });
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

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

const ShoppingList = (props) => {
  return (
    <div>
      <Table id={props.id} />
    </div>
  );
};

export default ParentComponent;