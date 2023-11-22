import React, { useState } from "react";
import "../styles/EditPermissionsModal.css";

const EditPermissionsModal = ({ shoppingList, onClose, currentUser }) => {
  const [users, setUsers] = useState([...shoppingList.sharedTo, shoppingList.owner]);
  const [newUser, setNewUser] = useState("");

  const handleAddUser = () => {
    if (newUser && !users.includes(newUser)) {
      setUsers([...users, newUser]);
      setNewUser("");
    }
  };

  const handleRemoveUser = (user) => {
    if (user !== shoppingList.owner) {
      setUsers(users.filter((u) => u !== user));
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2 className="black-text">Edit Permissions</h2>
        <p className="black-text">Users:</p>
        <ul className="user-list">
          {users.map((user) => (
            <li key={user} className="user-item">
              <div className="user-name">{user}</div>
              {user !== shoppingList.owner && (
                <button onClick={() => handleRemoveUser(user)}>Remove</button>
              )}
            </li>
          ))}
        </ul>
        <div>
          <input type="text" value={newUser} onChange={(e) => setNewUser(e.target.value)} />
          <button onClick={handleAddUser}>Add User</button>
        </div>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default EditPermissionsModal;
