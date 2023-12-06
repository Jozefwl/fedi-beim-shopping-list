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
          setShoppingList(response.data);
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



  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading shopping list: {error.message}</div>;
  if (!shoppingList) return <div>Shopping list not found.</div>;

  return (
    <EditList
      shoppingList={shoppingList}
      setShoppingList={setShoppingList}
      isCreation={isCreation === 'true'}
    />
  );
};


const EditList = ({ shoppingList, setShoppingList, isCreation }) => {
  const [listName, setListName] = useState(shoppingList.shoppingListName);
  const [items, setItems] = useState(shoppingList.items || []);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const handleItemChange = (itemId, field, newValue) => {
    const updatedItems = items.map((item) =>
      item.id === itemId ? { ...item, [field]: newValue } : item
    );
    setItems(updatedItems);
  };

  const handleItemDelete = (itemId) => {
    const updatedItems = items.filter((item) => item.id !== itemId);
    setItems(updatedItems);
  };

  const handleItemEditToggle = (itemId) => {
    const updatedItems = items.map((item) =>
      item.id === itemId ? { ...item, isEditing: !item.isEditing } : item
    );
    setItems(updatedItems);
  };

  const handleItemEditFinish = (itemId) => {
    const updatedItems = items.map((item) =>
      item.id === itemId ? { ...item, isEditing: false } : item
    );
    setItems(updatedItems);
  };

  const handleItemAdd = () => {
    const newItem = {
      id: `${items.length + 1}`,
      name: "",
      category: "",
      quantity: "",
      isEditing: true,
    };
    setItems([...items, newItem]);
  };

  const handleListNameChange = () => {
    const newName = prompt("Enter new shopping list name:", listName);
    if (newName !== null) {
      setListName(newName);
    }
  };
  const handleListDelete = () => {
    if (window.confirm("Are you sure you want to delete this list?")) {
      // Delete the list
    }
  };

  const handleListUpdate = async () => {
    //  logic to update the shopping list
    console.log("Updated list:", listName, items);
    // Update the shoppingList state in the parent component
    setShoppingList({ ...shoppingList, shoppingListName: listName, items });
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
                  <input
                    className="inputbox"
                    type="text"
                    value={item.category}
                    onChange={(e) =>
                      handleItemChange(item.id, "category", e.target.value)
                    }
                  />
                ) : (
                  capitalizeFirstLetter(item.category)
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
        <Button className="button-default" onClick={handlePermissionsClick}>Edit Permissions</Button>
        <Button className="button-default" id="deleteList" onClick={handleListDelete}>Delete List</Button>
        <Button className="button-default" >Archive List</Button>
        <Button className="button-default" disabled={items.length === 0 || shoppingList.name === ""} onClick={() => handleListUpdate()}>Finish Changes</Button>
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