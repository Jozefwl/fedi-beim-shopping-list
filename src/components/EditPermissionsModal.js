import React, { useState } from "react";
import "../styles/EditPermissionsModal.css";

const EditPermissionsModal = ({ shoppingList, onClose, currentUser }) => {
  const [users, setUsers] = useState([...shoppingList.sharedTo, shoppingList.owner]);
  const [newUser, setNewUser] = useState("Username... ");

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

  return (
    <div className="epm-modal">
      <div className="epm-modal-content">
        <h2 className="epm-black-text">Edit Permissions</h2>
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
            onChange={(e) => setNewUser(e.target.value)} 
            className="epm-input"
          />
          <button className="epm-add-btn" onClick={handleAddUser}>Add User</button>
        </div>
        <button className="epm-close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default EditPermissionsModal;
