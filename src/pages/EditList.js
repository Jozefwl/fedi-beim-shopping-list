import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import UserContext from "../components/UserContext";
import { FaEdit, FaCheck, FaTrash } from "react-icons/fa";
import Button from 'react-bootstrap/Button';
import EditPermissionsModal from "../components/EditPermissionsModal";
import "../styles/ErrorMsg.css";
import "../styles/EditList.css";

//Translation
import { useTranslation } from "react-i18next";
// const [t, i18n] = useTranslation("global")
// shoppingList, listViewer, listEditor, navbar
// {t("location.access")}
//-----

const ParentComponent = () => {
  const { userId } = useContext(UserContext);
  const { shoppingListId, isCreation } = useParams();
  const [shoppingList, setShoppingList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [t, i18n] = useTranslation("global")

  useEffect(() => {
    const fetchShoppingList = async () => {
      if (isCreation === 'true') {
        setShoppingList({
          shoppingListName: "",
          ownerId: userId,
          sharedTo: [],
          items: []
        });
        setLoading(false);
      } else {
        try {
          setLoading(true);
          const token = localStorage.getItem('token');
          const authHeader = token ? `Bearer ${token}` : 'Bearer ';
          const response = await axios.get(`http://194.182.91.65:3000/getList/${shoppingListId}`, {
            headers: { Authorization: authHeader }
          });
          const fetchedItems = response.data.items.map((item) => ({
            ...item,
            _id: item._id, // Use _id from the database as the key identifier
            isEditing: false,
          }));

          setShoppingList({
            ...response.data,
            items: fetchedItems,
          });
          // Check if user is owner or is in sharedto for public lists         
          if (response.data.ownerId === userId || response.data.sharedTo.includes(userId)) {
            setIsAuthorized(true);
          } else {
            setIsAuthorized(false);
          }
        } catch (error) {
          console.error(t("errors.errorFetching"), error);
          setError(error);
        } finally {
          setLoading(false);

        }

      }
    };

    fetchShoppingList();


  }, [shoppingListId, isCreation, userId]);

  if (isCreation === 'true') {
    return (
      <EditList
        shoppingList={shoppingList}
        setShoppingList={setShoppingList}
        isCreation={isCreation === 'true'}
      />
    );
  }


  if (!isAuthorized || isCreation) {
    return <div className="unauthorized">{t("errors.unauthorizedEdit")}</div>;
  }


  if (loading) return <div className="unauthorized">{t("errors.loading")}</div>;
  if (!userId) return <div className="unauthorized">{t("navbar.plsLogin")}</div>;
  if (error) return <div className="unauthorized">{t("errors.errorLoading")} {error.message}</div>;
  if (!shoppingList) return <div className="unauthorized">{t("errors.listNotFound")}</div>;

  return (
    <EditList
      shoppingList={shoppingList}
      setShoppingList={setShoppingList}
      isCreation={false}
      shoppingListId={shoppingListId}
    />
  );
};


const EditList = ({ shoppingList, shoppingListId, isCreation }) => {
  const [listName, setListName] = useState(shoppingList?.shoppingListName || "");
  const [items, setItems] = useState(shoppingList?.items || []);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const categories = ['Groceries', 'Beverages', 'Supplies', 'Belongings', 'Other'];
  const [deletedItems, setDeletedItems] = useState([]);
  const appTheme = localStorage.getItem('appTheme') || "dark";
  const selectedTheme = appTheme === 'dark' ? '' : '-light';
  const [t, i18n] = useTranslation("global")
  const isMobile = window.innerWidth <= 768;


  // Translated categories for display
  const translatedCategories = categories.map(category => ({
    label: t(`shoppingList.categories.${category}`), // Translated label
    value: category // Internal value
  }));

  const updateItem = (itemId, updateCallback) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item._id === itemId ? { ...item, ...updateCallback(item) } : item
      )
    );
  };

  const handleItemChange = (itemId, field, newValue) => {
    updateItem(itemId, (item) => ({ [field]: newValue }));
  };

  const handleInputClick = (item, field) => {
    if (isMobile) {
      let fieldTranslation;
      if (field === 'name') {
        fieldTranslation = t("shoppingList.itemName");
      } else if (field === 'quantity') {
        fieldTranslation = t("shoppingList.itemQty");
      } else {
        fieldTranslation = field;
      }
      const newValue = window.prompt(`${t("listEditor.newValue")} ${fieldTranslation}`, item[field]);
      if (newValue !== null) {
        handleItemChange(item._id, field, newValue);
      }
    }
  };

  const handleCategoryChange = (itemId, newCategory) => {
    updateItem(itemId, (item) => ({ category: newCategory }));
  };

  const handleItemDelete = (itemId) => {
    // Update the quantity of the item to 0
    if (isCreation) {
      // If creating a new list, remove the item from the array
      setItems(prevItems => prevItems.filter(item => item._id !== itemId));
    } else {
      if (itemId.toString().startsWith('new-')) {
        setItems(prevItems => prevItems.filter(item => item._id !== itemId));
      } else {
        updateItem(itemId, item => ({ ...item, quantity: 0 }));
      }
      // If editing an existing list, set quantity to 0      
    }

    // Add the item to the deletedItems array
    setDeletedItems((prevDeletedItems) => {
      const deletedItem = items.find(item => item._id === itemId);
      if (deletedItem && !prevDeletedItems.some(item => item._id === itemId)) {
        return [...prevDeletedItems, deletedItem];
      }
      return prevDeletedItems;
    });
  };


  const handleItemEditToggle = (itemId) => {
    updateItem(itemId, (item) => ({ isEditing: !item.isEditing }));
  };

  const handleItemEditFinish = (itemId) => {
    const itemIndex = items.findIndex(item => item._id === itemId);
    if (itemIndex !== -1) {
      const item = items[itemIndex];
      // Check if name is empty or quantity is invalid
      if (!item.name.trim() || isNaN(item.quantity) || item.quantity <= 0) {
        alert(t("errors.invalidItemParams")+`${itemIndex + 1}.`);
        return;
      }
      updateItem(itemId, (item) => ({ isEditing: false }));
    }
  };


  const handleItemAdd = () => {
    const newItemId = `new-${Date.now()}`;
    const newItem = {
      _id: newItemId, // Unique temporary identifier
      name: "",
      category: "Other",
      quantity: 1,
      isEditing: true,
      checked: false,
    };
    setItems([...items, newItem]);
  };

  const handleListNameChange = () => {
    const newName = prompt(t("listEditor.enterNewName"), listName);
  
    if (newName !== null) {
      // Check if name is longer than 128 characters
      if (newName.length > 128) {
        alert(t("errors.errorNameTooLong"));
        return;
      }  
      // check if word is longer than 20 characters
      const words = newName.split(/\s+/); // Split by any whitespace
      const wordTooLong = words.some(word => word.length > 20);
  
      if (wordTooLong) {
        alert(t("errors.errorWordTooLong"));
        return;
      }

      setListName(newName);
    }
  };
  

  const handleListDelete = async () => {
    if (window.confirm(t("listEditor.deleteConfirmation"))) {
      try {
        const token = localStorage.getItem('token'); // Get the auth token
        const authHeader = token ? `Bearer ${token}` : 'Bearer ';
        await axios.delete(`http://194.182.91.65:3000/deleteList/${shoppingList._id}`, {
          headers: { Authorization: authHeader }
        });

        window.alert(t("listEditor.deleteSuccess"));
        window.location.href = '/';
        window.location.reload();
      } catch (error) {
        console.error("Error deleting list", error);
        if (error.response && error.response.status === 403) {
          window.alert(t("errors.deleteNotOwner"));
        } else {
          window.alert(t("errors.deleteError"));
        }
      }
    }
  };


  const validateInputs = () => {
    if (!listName.trim()) {
      alert(t("errors.noListName"));
      return false;
    }
  
    if (items.length === 0) {
      alert(t("errors.noListItems"));
      return false;
    }
  
    for (let index = 0; index < items.length; index++) {
      const item = items[index];
      if (!item.name.trim()) {
        let alertMsg = `${t("errors.itemBegin")} ${index + 1} ${t("errors.itemNoName")}`;
        alert(alertMsg);
        return false;
      }
      if (isNaN(item.quantity) || item.quantity < 0 || (isCreation && item.quantity === 0)) {
        let alertMsg = `${t("errors.itemBegin")} ${index + 1} ${t("errors.itemNoQty")}`;
        alert(alertMsg);
        return false;
      }
    }
  
    return true;
  };  

  const handleListUpdateOrCreate = async () => {
    // Construct the request payload
    const payload = {
      shoppingListName: listName,
      items: items.map((item) => ({
        name: item.name,
        category: item.category || 'Other',
        quantity: parseInt(item.quantity),
        checked: item.checked,
        ...(item._id && !item._id.startsWith('new-') && { _id: item._id }), // Include _id only if it exists and is not a temporary ID
      }))
    };

    if (isCreation) {
      try {
        // Send the POST request
        const token = localStorage.getItem('token'); // Ensure you get the token
        const response = await axios.post('http://194.182.91.65:3000/createList/', payload, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        // Handle the response
        // console.log('List created:', response.data);
        window.location.href = `/shoppingList/${response.data.list._id}`;
      } catch (error) {
        alert(t("listEditor.failedCreation"), error.message);
        // Handle error (show error message to user, etc.)
      }
    } else {
      // Logic for updating an existing list
      try {
        // Send the PUT request
        const token = localStorage.getItem('token');
        const response = await axios.put(`http://194.182.91.65:3000/updateList/${shoppingList._id}`, payload, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        // Handle the response
        // console.log('List updated:', response.data);
        window.location.href = `/shoppingList/${response.data._id}`
        // Additional logic to handle the updated list (e.g., updating UI, redirecting)
      } catch (error) {
        console.error(t("errors.errorUpdating"), error);
        // Error handling logic
      }
    }
  };

  const handleListArchive = async (shoppingList) => {
    const shoppingListId = shoppingList._id;
    if (shoppingList.isArchived) {
      if (window.confirm(t("listEditor.unarchiveConfirmation"))) {
        try {
          const token = localStorage.getItem('token'); // Get the auth token
          const header = {
            headers: {
              'Authorization': `Bearer ${token}`,
            }
          };
          const response = await axios.put(`http://194.182.91.65:3000/updateList/${shoppingListId}`, {
            isArchived: false
          }, header);

          if (response.status === 200) {
            alert(t("listEditor.unarchiveSuccess"));
            window.location.href = '/';
          } else {
            console.error(t("errors.errorUnarchiving"), response);
          }
        } catch (error) {
          console.error(t("errors.errorUnarchiving"), error);
        }

      }
    } else {
      if (window.confirm(t("listEditor.archiveConfirmation"))) {
        try {
          const token = localStorage.getItem('token'); // Get the auth token
          const header = {
            headers: {
              'Authorization': `Bearer ${token}`,
            }
          };
          const response = await axios.put(`http://194.182.91.65:3000/updateList/${shoppingListId}`, {
            isArchived: true
          }, header);

          if (response.status === 200) {
            alert((t("listEditor.archiveSuccess")));
            window.location.href = '/';
          } else {
            console.error(t("errors.errorArchiving"), response);
          }
        } catch (error) {
          console.error(t("errors.errorArchiving"), error);
        }
      }
    }
  };

  const handlePermissionsClick = () => {
    setShowPermissionsModal(true);
  };

  const handlePermissionsClose = () => {
    setShowPermissionsModal(false);
  };

  return (
    <div>
      <h1 className="header-name-text">
        {listName}{" "}
        <Button className="btn-square" onClick={handleListNameChange}>
          <FaEdit />
        </Button>
      </h1>
      <table className={`table${selectedTheme}`}>
        <thead>
          <tr>
            <th>{t("shoppingList.itemName")}</th>
            <th>{t("shoppingList.itemCtg")}</th>
            <th>{t("shoppingList.itemQty")}</th>
            <th>{t("shoppingList.edit")}</th>
            <th>{t("shoppingList.delete")}</th>
          </tr>
        </thead>
        <tbody>
          {items
            .filter(item => item.isEditing || item.quantity > 0)
            .map((item) => (
              <tr key={item._id || item.id}>
                <td>
                  {item.isEditing ? (
                    <input
                    className="inputbox"
                    type="text"
                    value={item.name}
                    onClick={() => handleInputClick(item, "name")}
                    onChange={(e) => handleItemChange(item._id, "name", e.target.value)}
                    readOnly={isMobile} // Make input readOnly on mobile to prevent keyboard popup
                  />
                  ) : (
                    item.name
                  )}
                </td>
                <td>
                  {item.isEditing ? (
                    <select
                      className="inputbox"
                      value={item.category}
                      onChange={(e) => handleCategoryChange(item._id, e.target.value)}
                    >
                      {translatedCategories.map(category => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    t("shoppingList.categories."+item.category)
                  )}
                </td>
                <td>
                  {item.isEditing ? (
                    <input
                    className="inputbox"
                    type="number"
                    value={item.quantity}
                    onClick={() => handleInputClick(item, "quantity")}
                    onChange={(e) => handleItemChange(item._id, "quantity", parseInt(e.target.value))}
                    readOnly={isMobile} // Make input readOnly on mobile to prevent keyboard popup
                    pattern="\d*"
                  />
                  ) : (
                    item.quantity
                  )}
                </td>
                <td>
                  {item.isEditing ? (
                    <Button className="btn-square" onClick={() => handleItemEditFinish(item._id)}>
                      <FaCheck />
                    </Button>
                  ) : (
                    <Button className="btn-square" onClick={() => handleItemEditToggle(item._id)}>
                      <FaEdit />
                    </Button>
                  )}
                </td>
                <td>
                  <Button className="btn-square" onClick={() => handleItemDelete(item._id)}>
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <div className="button-group">
        <Button className={`button-default${selectedTheme}`} onClick={handleItemAdd}>{t("listEditor.addItem")}</Button>
        <Button className={`button-default${selectedTheme}`} id="editPermissions"
          onClick={() => {
            if (isCreation) {
              alert(t("errors.permsAfterCreation"));
            } else {
              handlePermissionsClick();
            }
          }}
        >{t("listEditor.editPerms")}</Button>
        {!isCreation && (
          <Button className={`button-default${selectedTheme}`} id={`deleteList${selectedTheme}`} onClick={() => handleListDelete(shoppingListId)}>
            {t("listEditor.deleteList")}
          </Button>
        )}
        <Button className={`button-default${selectedTheme}`} onClick={() => 
          {
            if (isCreation) {
              alert(t("errors.archiveAfterCreation"));
            } else {
              handleListArchive(shoppingList);
            }
          }}>{t("listEditor.archiveList")}</Button>
        <Button
          className={`button-default${selectedTheme}`}
          onClick={() => {{
            if (window.confirm(t("listEditor.finishChangesConfirmation"))) {
              let isValidated=validateInputs()
              if (!isValidated) {
                  return; // Stop the function if validation fails
              } else if (isValidated){
                handleListUpdateOrCreate();
              }
            }
          }}}
        >{t("listEditor.finishChanges")}</Button>
      </div>
      {showPermissionsModal && (
        <EditPermissionsModal
          shoppingList={shoppingList}
          onClose={handlePermissionsClose}
        />
      )}
    </div>
  );
};

export default ParentComponent;