import React, { useState, useEffect } from "react";
import "../styles/EditPermissionsModal.css";
import axios from "axios";
import { useTranslation } from "react-i18next";

const EditPermissionsModal = ({ shoppingList, onClose }) => {
  const [users, setUsers] = useState([...shoppingList.sharedTo]);
  const [newUser, setNewUser] = useState("");
  const [usernames, setUsernames] = useState({});
  const [isPublic, setIsPublic] = useState(shoppingList.isPublic);
  const username = localStorage.getItem('username');
  const [t] = useTranslation("global")

  //Translation

//import { changeLanguage } from "i18next";
// const [t, i18n] = useTranslation("global")
// shoppingList, listViewer, listEditor, navbar
// {t("location.access")}
//-----

  useEffect(() => {
    setUsers([...shoppingList.sharedTo]);
    setIsPublic(shoppingList.isPublic);
  }, [shoppingList]);

  useEffect(() => {
    // Function to fetch usernames for user IDs
    const fetchUsernames = async (userIds) => {
      try {
        const response = await axios.post('http://194.182.91.65:3000/getUsernames', { userIds: userIds });
        setUsernames(response.data); // Update the usernames state
      } catch (error) {
        console.error('Error fetching usernames:', error);
      }
    };

    if (users.length > 0) {
      fetchUsernames(users);
    }
  }, [users]);

  const handleAddUser = () => {
    if (newUser && !users.includes(newUser) && newUser !== username) {
      setUsers([...users, newUser]);
      setNewUser("");
    }
  };

  const handleRemoveUser = (user) => {
    if (user !== shoppingList.ownerId) {
      setUsers(users.filter((u) => u !== user));
    }
  };

  const handleVisibilityChange = (e) => {
    console.log("New visibility selected:", e.target.value);
    setIsPublic(e.target.value === "Public");
  };

  const handleSaveChanges = async () => {
    const updatedUsernames = users.map((userId) => usernames[userId] || userId);

    const updatedShoppingList = {
      sharedTo: updatedUsernames,
      isPublic: isPublic
    };

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://194.182.91.65:3000/updateList/${shoppingList._id}`, updatedShoppingList, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      //console.log("Updated Shopping List Response:", response.data);
      onClose();
      window.location.reload();
    } catch (error) {
      // Check if the error response has data and a message
      const errorMessage = error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : 'Error updating shopping list. Please try again later.';
      alert(errorMessage);
    }
  };

  return (
    <div className="epm-modal">
      <div className="epm-modal-content">
        <h2 className="epm-black-text">{t("permissionsModal.editPerms")}</h2>
        <div className="epm-visibility-select">
          <label className="epm-black-text">{t("permissionsModal.visibility")}</label>
          <select value={isPublic ? "Public" : "Private"} onChange={handleVisibilityChange}>
            <option value="Public">{t("permissionsModal.public")}</option>
            <option value="Private">{t("permissionsModal.private")}</option>
          </select>
        </div>
        <p className="epm-black-text">{t("permissionsModal.users")}</p>
        <ul className="epm-user-list">
          {users.map((user) => (
            <li key={user} className="epm-user-item">
              <div className="epm-user-name">{usernames[user] || user}</div>
              {user !== shoppingList.ownerId && (
                <button className="epm-remove-btn" onClick={() => handleRemoveUser(user)}>{t("permissionsModal.remove")}</button>
              )}
            </li>
          ))}
        </ul>
        <div>
          <input
            type="text"
            value={newUser}
            placeholder={t("appjs.username")}
            onChange={(e) => setNewUser(e.target.value)}
            className="epm-input"
          />
          <button className="epm-add-btn" onClick={handleAddUser}>{t("permissionsModal.addUser")}</button>
        </div>
        <button className="epm-close-btn" onClick={onClose}>{t("permissionsModal.discard")}</button>
        <button className="epm-close-btn" onClick={handleSaveChanges}>{t("permissionsModal.saveChanges")}</button>
      </div>
    </div>
  );
};

export default EditPermissionsModal;