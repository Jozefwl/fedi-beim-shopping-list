import React, { useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { FaEdit, FaCheck, FaTrash } from "react-icons/fa";
import shoppingListsData from "../data/shoppinglists.json";
import UserContext from "../components/UserContext";
import "../styles/ErrorMsg.css";



const ParentComponent = () => {
  const username = useContext(UserContext);
  const { shoppingListId } = useParams();

  const shoppingList = shoppingListsData[shoppingListId];

  if (!shoppingList) {
    return <div className="unauthorized"><h1>Shopping list not found.</h1></div>;
  } else if (username === shoppingList.owner || username === shoppingList.sharedTo) {
    return <EditList shoppingList={shoppingList} />;
  } else {
    return <div className="unauthorized">You are not authorized to edit this shopping list.</div>;
  }
};

const EditList = ({ shoppingList }) => {
  
  const [listName, setListName] = useState(shoppingList.shoppingListName);
  const [items, setItems] = useState(
    Object.entries(shoppingList.name).map(([id, name]) => ({
      id,
      name,
      category: shoppingList.category[id],
      quantity: shoppingList.quantity[id],
      isEditing: false,
    }))
  );

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
      <button onClick={handleItemAdd}>Add Item</button>
      <div>
        <button>Edit Permissions</button>
        <button onClick={handleListDelete}>Delete List</button>
        <button>Archive List</button>
      </div>
    </div>
  );
};

export default ParentComponent;
