import React, { useState, useRef } from "react";
import "../styles/EditPermissionsModal.css";

const EditPermissionsModal = ({ shoppingList, onClose, currentUser }) => {
  const [users, setUsers] = useState([...shoppingList.sharedTo, shoppingList.owner]);
  const [newUser, setNewUser] = useState("");
  // Declare listVisibility state and its setter function
  const [listVisibility, setListVisibility] = useState(shoppingList.state); // Assuming 'state' holds 'Public' or 'Private'

  const handleAddUser = () => {
    if (newUser && !users.includes(newUser)) {
      setUsers([...users, newUser]);
      setNewUser("");
    }
  };

  const handleRemoveUser = (user) => {
    if (user === shoppingList.owner) {
      alert("You cannot remove yourself from the list. Please transfer ownership to another user first.");
    } else {
      setUsers(users.filter((u) => u !== user));
    }
  };

  const handleVisibilityChange = (e) => {
    setListVisibility(e.target.value);
  };

  const handleSaveChanges = () => {

    // Check if the shopping list has at least one item
    const itemEntries = Object.entries(shoppingList.name);
    if (itemEntries.length === 0) {
      alert("The shopping list must have at least one item.");
      return;
    }
  
    const updatedShoppingList = {
      ...shoppingList,
      sharedTo: users.filter(user => user !== shoppingList.owner),
      state: listVisibility
    };

    console.log("Updated Shopping List:", updatedShoppingList);
    onClose(); 
  };

  return (
    <div className="epm-modal">
      <div className="epm-modal-content">
        <h2 className="epm-black-text">Edit Permissions</h2>
        <div className="epm-visibility-select">
          <label className="epm-black-text">Visibility: </label>
          <select value={listVisibility} onChange={handleVisibilityChange}>
            <option value="Public">Public</option>
            <option value="Private">Private</option>
          </select>
        </div>
        <p className="epm-black-text">Users:</p>
        <ul className="epm-user-list">
          {users.map((user) => (
            <li key={user} className="epm-user-item">
              <div className="epm-user-name">{user}</div>
              {currentUser !== shoppingList.owner && (
                <button className="epm-remove-btn" onClick={() => handleRemoveUser(user)}>Remove</button>
              )}
            </li>
          ))}
        </ul>
        <div>
          <input
            type="text"
            value={newUser}
            placeholder="Username..."
            onChange={(e) => setNewUser(e.target.value)}
            className="epm-input"
          />
          <button className="epm-add-btn" onClick={handleAddUser}>Add User</button>
        </div>
        <button className="epm-close-btn" onClick={onClose}>Discard</button> <button className="epm-close-btn" onClick={handleSaveChanges}>Save Changes</button>
      </div>
    </div>
  );
};

export default EditPermissionsModal;
