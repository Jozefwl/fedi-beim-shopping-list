import React, { useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { FaEdit, FaCheck, FaTrash } from "react-icons/fa";
import shoppingListsData from "../data/shoppinglists.json";
import UserContext from "../components/UserContext";
import "../styles/ErrorMsg.css";
import "../styles/EditList.css";
import EditPermissionsModal from "../components/EditPermissionsModal";



const ParentComponent = () => {
  const username = useContext(UserContext);
  const { shoppingListId } = useParams();

  const shoppingList = shoppingListsData[shoppingListId];
  const shoppingListSharedTo = shoppingList.sharedTo;
  const isSharedWithOwner = (username, shoppingListSharedTo) => {
    let isSharedWithOwner = false;
  
    for (let i = 0; i < shoppingListSharedTo.length; i++) {
      if (username === shoppingListSharedTo[i]) {
        isSharedWithOwner = true;
        break; // Exit the loop if a match is found
      }
    }
  
    return isSharedWithOwner;
  }
  const isSharedWith = isSharedWithOwner(username, shoppingListSharedTo);


  if (!shoppingList) {
    return <div className="unauthorized"><h1>Shopping list not found.</h1></div>;
  } else if (username === shoppingList.owner || isSharedWith === true) {
    return <EditList shoppingList={shoppingList} />;
  } else {
    return <div className="unauthorized">You are not authorized to edit this shopping list.</div>;
  }
};

const EditList = ({ shoppingList }) => {
  const [listName, setListName] = useState(shoppingList.shoppingListName);
  const [items, setItems] = useState(
    shoppingList.name
      ? Object.entries(shoppingList.name).map(([id, name]) => ({
        id,
        name,
        category: shoppingList.category[id],
        quantity: shoppingList.quantity[id],
        isEditing: false, // Initialize isEditing property
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

  const handleItemChange = (itemId, field, newValue) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, [field]: newValue } : item
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

  return (
    <div>
      <h1>
        {listName}{" "}
        <button onClick={handleListNameChange}>
          <FaEdit />
        </button>
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
                  <input
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
                  <input
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
                  <input
                    type="text"
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
                  <button onClick={() => handleItemEditFinish(item.id)}>
                    <FaCheck />
                  </button>
                ) : (
                  <button onClick={() => handleItemEditToggle(item.id)}>
                    <FaEdit />
                  </button>
                )}
              </td>
              <td>
                <button onClick={() => handleItemDelete(item.id)}>
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="button-group">
        <button className="button" onClick={handleItemAdd}>Add Item</button>
        <div>
          {showPermissionsModal && (
            <EditPermissionsModal shoppingList={shoppingList} onClose={handlePermissionsClose} />
          )}
          <button className="button" onClick={handlePermissionsClick}>Edit Permissions</button>
          <button className="button" onClick={handleListDelete}>Delete List</button>
          <button className="button" >Archive List</button>
        </div>
      </div>
    </div>
  );
};

export default ParentComponent;
