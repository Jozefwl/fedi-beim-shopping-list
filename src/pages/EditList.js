import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import UserContext from "../components/UserContext";
import { FaEdit, FaCheck, FaTrash } from "react-icons/fa";
import Button from 'react-bootstrap/Button';
import EditPermissionsModal from "../components/EditPermissionsModal";
import "../styles/ErrorMsg.css";
import "../styles/EditList.css";

const ParentComponent = () => {
  const { userId } = useContext(UserContext);
  const { shoppingListId, isCreation } = useParams();
  const [shoppingList, setShoppingList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);

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
          const fetchedItems = response.data.items.map((item, index) => ({
            ...item,
            id: item.id || `item-${index}`, // Assign a unique ID if not present
            isEditing: false, // Initialize isEditing state
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
          console.error("Error fetching shopping list", error);
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
    return <div className="unauthorized">You are not authorized to edit this list.</div>;
  }


  if (loading) return <div className="unauthorized">Loading...</div>;
  if (!userId) return <div className="unauthorized">Please Log In.</div>;
  if (error) return <div className="unauthorized">Error loading shopping list: {error.message}</div>;
  if (!shoppingList) return <div className="unauthorized">Shopping list not found.</div>;

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

  const updateItem = (itemId, updateCallback) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, ...updateCallback(item) } : item
      )
    );
  };

  const handleItemChange = (itemId, field, newValue) => {
    updateItem(itemId, (item) => ({ [field]: newValue }));
  };

  const handleCategoryChange = (itemId, newCategory) => {
    updateItem(itemId, (item) => ({ category: newCategory }));
  };

  const handleItemDelete = (itemId) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  const handleItemEditToggle = (itemId) => {
    updateItem(itemId, (item) => ({ isEditing: !item.isEditing }));
  };

  const handleItemEditFinish = (itemId) => {
    updateItem(itemId, (item) => ({ isEditing: false }));
  };

  const handleItemAdd = () => {
    const newItem = {
      id: `${items.length + 1}`,
      name: "",
      category: "Other", // Default category
      quantity: "",
      isEditing: true,
      checked: false, // Default checked to false for every item
    };
    setItems([...items, newItem]);
  };

  const handleListNameChange = () => {
    const newName = prompt("Enter new shopping list name:", listName);
    if (newName !== null) {
      setListName(newName);
    }
  };


  const handleListDelete = async (shoppingListId) => {

    if (window.confirm("Are you sure you want to delete this list?")) {
      try {
        const token = localStorage.getItem('token'); // Get the auth token
        const response = await axios.delete(`http://194.182.91.65:3000/deleteList/${shoppingListId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });

        if (response.status === 200) {
          console.log('List deleted successfully');
          window.location.href = '/'; // Redirect to homepage with full page reload
        } else {
          console.error('Error deleting list:', response);
          // Handle unsuccessful deletion here (show error message, etc.)
        }
      } catch (error) {
        console.error('Error while deleting the list:', error);
        // Handle error while making the request (show error message, etc.)
      }
    }
  };


  const validateInputs = () => {
    if (!listName.trim()) {
      alert("Shopping list name is required.");
      return false;
    } else

      if (items.length === 0) {
        alert("Shopping list must have at least one item.");
        return false;
      } else {
        items.forEach((item, index) => {
          if (!item.name.trim()) {
            alert(`Item ${index + 1} is missing a name.`);
            return false;
          } if (!item.quantity || item.quantity <= 0) {
            alert(`Item ${index + 1} has an invalid quantity.`);
            return false;
          }
        });
      }
    return true;
  };

  const handleListUpdateOrCreate = async () => {
    // Construct the request payload
    const payload = {
      shoppingListName: listName,
      items: items.map(item => ({
        name: item.name,
        category: item.category || 'Other', //Default if nothing is selected
        quantity: item.quantity,
        checked: item.checked
      })),
      sharedTo: shoppingList.sharedTo,
      isPublic: shoppingList.isPublic
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
        console.log('List created:', response.data);
        window.location.href = `/shoppingList/${response.data.list._id}`;
        // You might want to navigate to the new list or update the state
      } catch (error) {
        console.error('Error creating list', error);
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
        console.log('List updated:', response.data);
        window.location.href = `/shoppingList/${response.data._id}`
        // Additional logic to handle the updated list (e.g., updating UI, redirecting)
      } catch (error) {
        console.error('Error updating list', error);
        // Error handling logic
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
                  <input
                    className="inputbox"
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
                  <select
                    className="inputbox"
                    value={item.category}
                    onChange={(e) => handleCategoryChange(item.id, e.target.value)}
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                ) : (
                  item.category
                )}
              </td>
              <td>
                {item.isEditing ? (
                  <input
                    className="inputbox"
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
        <Button className="button-default" onClick={handleItemAdd}>Add Item</Button>
        <Button className="button-default" onClick={handlePermissionsClick}>Edit Permissions</Button>
        {!isCreation && (
          <Button className="button-default" id="deleteList" onClick={() => handleListDelete(shoppingListId)}>
            Delete List
          </Button>
        )}
        <Button className="button-default" >Archive List</Button>
        <Button
          className="button-default"
          onClick={() => {
            if (window.confirm("Are you sure you want to finish changes?")) {
              if (!validateInputs()) {
                // hihi
              } else {
                handleListUpdateOrCreate();
              }
            }
          }}
        >Finish Changes</Button>
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