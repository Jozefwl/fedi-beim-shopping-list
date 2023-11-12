import React, { useState } from "react";
import "../styles/EditPermissionsModal.css";

const EditPermissionsModal = ({ shoppingList, onClose }) => {
  const [users, setUsers] = useState([...shoppingList.sharedTo, shoppingList.owner]);
  const [newUser, setNewUser] = useState("");

  const handleAddUser = () => {
    if (newUser && !users.includes(newUser)) {
      setUsers([...users, newUser]);
      setNewUser("");
    }
  };

  const handleRemoveUser = (user) => {
    setUsers(users.filter((u) => u !== user));
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Edit Permissions</h2>
        <p className="black-text">Users:</p>
        <ul className="black-text">
          {users.map((user) => (
            <li key={user}>
              {user}
              <button onClick={() => handleRemoveUser(user)}>Remove</button>
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