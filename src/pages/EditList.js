import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaEdit, FaCheck, FaTrash } from "react-icons/fa";

import UserContext from "../components/UserContext";
import "../styles/ErrorMsg.css";
import "../styles/EditList.css";
import EditPermissionsModal from "../components/EditPermissionsModal";
import Button from 'react-bootstrap/Button';
import shoppingListsData from "../data/shoppinglists.json"; // Importing the shopping lists

const ParentComponent = () => {
  const username = useContext(UserContext);
  const params = useParams();
  const shoppingListId = params.shoppingListId; // Get shoppingListId from params
  const isCreation = params.isCreation;

  let shoppingList;
  let isSharedWith;

  const isSharedWithOwner = (username, shoppingListSharedTo) => {
    return shoppingListSharedTo.includes(username);
  }

  if (isCreation) {
    shoppingList = {
      "shoppingListName": "",
      "owner": username,
      "sharedTo": [],
      "state": "private", 
      "name": {},
      "category": {},
      "quantity": {},
      "checked": {}
    };
  } else {
    shoppingList = shoppingListsData[shoppingListId]; // Access shopping list using shoppingListId
    if (shoppingList) {
      isSharedWith = isSharedWithOwner(username, shoppingList.sharedTo);
    }
  }

  if (!shoppingList && !isCreation) {
    return <div className="unauthorized">Shopping list not found.</div>;
  }

  if (isCreation && username) {
    return <EditList shoppingList={shoppingList} shoppingListId={params.shoppingListId} isCreation={true} />;
  } else if (!isCreation) {
    if (username === shoppingList.owner || isSharedWith) {
      return <EditList shoppingList={shoppingList} shoppingListId={params.shoppingListId} isCreation={false} />;
    } else {
      return <div className="unauthorized">You are not authorized to edit this shopping list.</div>;
    }
  } else if (!username) {
    return <div className="unauthorized">Log in to create or edit a list.</div>;
  } else {
    return <div className="unauthorized">You are not authorized to access this page.</div>;
  }
};


const EditList = ({ shoppingList, shoppingListId, isCreation }) => {

  const [listName, setListName] = useState(isCreation ? '' : shoppingList.shoppingListName);
  const [items, setItems] = useState(
    isCreation
      ? []
      : shoppingList.name
        ? Object.entries(shoppingList.name).map(([id, name]) => ({
          id,
          name,
          category: shoppingList.category[id],
          quantity: shoppingList.quantity[id],
        }))
        : []
  );
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);


  const handlePermissionsClick = () => {
    setShowPermissionsModal(true);
  };

  const handlePermissionsClose = () => {
    setShowPermissionsModal(false);
  };

  const handleListNameChange = () => {
    const newName = prompt("Enter new shopping list name:");
    if (newName) {
      setListName(newName);
    }
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const handleItemChange = (itemId, field, newValue) => {
    // Capitalize first letter if the field is 'category'
    const updatedValue = field === 'category' ? capitalizeFirstLetter(newValue) : newValue;

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, [field]: updatedValue } : item
      )
    );
  };

  const handleItemDelete = (itemId) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  const handleItemEditToggle = (itemId) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, isEditing: !item.isEditing } : item
      )
    );
  };

  const handleItemEditFinish = (itemId) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, isEditing: false } : item
      )
    );
  };

  const handleItemAdd = () => {
    const newItem = {
      id: `${items.length + 1}`,
      name: "",
      category: "",
      quantity: "",
      isEditing: true,
    };
    setItems((prevItems) => [...prevItems, newItem]);
  };

  const handleListDelete = () => {
    if (window.confirm("Are you sure you want to delete this list?")) {
      // Delete the list
    }
  };

  const handleListUpdate = (shoppingListId) => {

    if (!listName.trim()) {
      alert("Please enter a name for the shopping list.");
      return;
    }

    const hasEmptyFields = items.some(item => !item.name.trim() || !item.category.trim() || !item.quantity.trim());

    if (hasEmptyFields) {
      alert("Please fill in all item fields (shopping list name, item name, category, quantity) before saving.");
      return;
    }
    if (window.confirm("Save changes to list?")) {
      // Convert the updated list to JSON
      const updatedList = {
        ...shoppingList,
        shoppingListName: listName,
        name: items.reduce((acc, curr) => ({ ...acc, [curr.id]: curr.name }), {}),
        category: items.reduce((acc, curr) => ({ ...acc, [curr.id]: curr.category }), {}),
        quantity: items.reduce((acc, curr) => ({ ...acc, [curr.id]: curr.quantity }), {}),
      };

      // Save updated list to local storage
      console.log(`shoppingList-${shoppingListId}`, JSON.stringify(updatedList));

      alert("List updated!");
    }
  }


  return (
    <div>

      <h1>
        {listName}{" "}
        <Button className="btn-square" onClick={handleListNameChange}>
          <FaEdit />
        </Button>
      </h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>
                {item.isEditing ? (
                  <input className="inputbox"
                    type="text"
                    value={item.name}
                    onChange={(e) =>
                      handleItemChange(item.id, "name", e.target.value)
                    }
                  />
                ) : (
                  item.name
                )}
              </td>
              <td>
                {item.isEditing ? (
                  <input className="inputbox"
                    type="text"
                    value={item.category}
                    onChange={(e) =>
                      handleItemChange(item.id, "category", e.target.value)
                    }
                  />
                ) : (
                  item.category
                )}
              </td>
              <td>
                {item.isEditing ? (
                  <input className="inputbox"
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemChange(item.id, "quantity", e.target.value)
                    }
                  />
                ) : (
                  item.quantity
                )}
              </td>
              <td>
                {item.isEditing ? (
                  <Button className="btn-square" onClick={() => handleItemEditFinish(item.id)}>
                    <FaCheck />
                  </Button>
                ) : (
                  <Button className="btn-square" onClick={() => handleItemEditToggle(item.id)}>
                    <FaEdit />
                  </Button>
                )}
              </td>
              <td>
                <Button className="btn-square" onClick={() => handleItemDelete(item.id)}>
                  <FaTrash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="button-group">
        <Button className="button-default" id="addItem" onClick={handleItemAdd}>Add Item</Button>
        <div>
          {showPermissionsModal && (
            <EditPermissionsModal shoppingList={shoppingList} onClose={handlePermissionsClose} />
          )}
          <Button className="button-default" onClick={handlePermissionsClick}>Edit Permissions</Button>
          <Button className="button-default" id="deleteList" onClick={handleListDelete}>Delete List</Button>
          <Button className="button-default" >Archive List</Button>
          <Button className="button-default" disabled={items.length === 0 || shoppingList.name === ""} onClick={() => handleListUpdate(shoppingListId)}>Finish Changes</Button>

        </div>
      </div>
    </div>
  );
};

export default ParentComponent;