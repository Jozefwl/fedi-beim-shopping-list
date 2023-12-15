import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/ErrorMsg.css";
import "../styles/Table.css";
import UserContext from "../components/UserContext";
import { useTranslation } from "react-i18next";

const ParentComponent = () => {
  const { shoppingListId } = useParams();
  const [shoppingList, setShoppingList] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = (localStorage.getItem('token') || null)
  const hreflink = "/edit/" + shoppingListId;
  const [t, i18n] = useTranslation("global")

  useEffect(() => {
    const fetchShoppingList = async () => {
      setLoading(true);
      try {
        const authHeader = token ? `Bearer ${token}` : 'Bearer ';
        const response = await axios.get(`http://194.182.91.65:3000/getList/${shoppingListId}`, {
          headers: { Authorization: authHeader }
        });
        setShoppingList(response.data);
      } catch (error) {
        console.error(t("errors.errorFetching"), error);
      } finally {
        setLoading(false);
      }
    };

    fetchShoppingList();
  }, [shoppingListId, token]);

  if (loading) {
    return <div>{t("errors.loading")}</div>;
  }

  if (!shoppingList) {
    return <div className="unauthorized"><h1>{t("errors.listNotFound")}</h1></div>;
  }

  return (
    <ShoppingList
      shoppingList={shoppingList}
      hreflink={hreflink}
      token={token}
    />
  );
};


const Table = ({ shoppingList, hreflink, canEdit }) => {
  const [t, i18n] = useTranslation("global")
  const appTheme = localStorage.getItem('appTheme') || "dark";
  const selectedTheme = appTheme === 'dark' ? '' : '-light';
  const token = (localStorage.getItem('token') || null)
  const navigate = useNavigate();
  const handleUpdateList = async () => {
    if (window.confirm(t("shoppingList.updateConfirmation"))) {
      try {
        const updatedItems = items.map(item => ({
          _id: item._id,
          checked: checkedItems[item._id]
        }));

        const authHeader = token ? `Bearer ${token}` : 'Bearer ';
        await axios.put(`http://194.182.91.65:3000/updateList/${shoppingList._id}`, { items: updatedItems }, {
          headers: { Authorization: authHeader }
        });

        window.alert(t("shoppingList.updateSuccess"));
      } catch (error) {
        console.error("Error updating list", error);
        window.alert(t("shoppingList.updateFail"));
      }
    }
  };

  //Check if all items are checked
  const renderDeletePrompt = () => {
    const allChecked = items.every(item => checkedItems[item._id]);
    if (allChecked) {
      return (
        <div className="everything-checked">
          <h1 >{t("shoppingList.allChecked")}</h1>
          <button className="everything-checked-button" onClick={handleDeleteList}>{t("shoppingList.deleteQuestion")}</button>
        </div>
      );
    }
    return null;
  };
  
  // each item in the shopping list has its own unique ID
  const items = shoppingList.items;

  const [filter, setFilter] = useState("unchecked");

  const toggleCategoryVisibility = (category) => {
    if (visibleCategories.includes(category)) {
      setVisibleCategories(visibleCategories.filter((c) => c !== category));
    } else {
      setVisibleCategories([...visibleCategories, category]);
    }
  };

  const handleCheckboxChange = (event) => {
    const itemId = event.target.value;
    const isChecked = event.target.checked;
    setCheckedItems({ ...checkedItems, [itemId]: isChecked });
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleDeleteList = async () => {
    if (window.confirm(t("listEditor.deleteConfirmation"))) {
      try {
        const authHeader = token ? `Bearer ${token}` : 'Bearer ';
        await axios.delete(`http://194.182.91.65:3000/deleteList/${shoppingList._id}`, {
          headers: { Authorization: authHeader }
        });
  
        window.alert(t("listEditor.deleteSuccess"));
        navigate('/');
        window.location.reload();
      } catch (error) {
        console.error(t("errors.deleteError"), error);
        if (error.response && error.response.status === 403) {
          window.alert(t("errors.deleteNotOwner"));
        } else {
          window.alert(t("errors.deleteError"));
        }
      }
    }
  };

  const initialCategory = items.length > 0 ? [items[0].category] : [];
  const [visibleCategories, setVisibleCategories] = useState(initialCategory);

  const [checkedItems, setCheckedItems] = useState(
    items.reduce((acc, item) => {
      acc[item._id] = item.checked; // each item has a 'checked' property
      return acc;
    }, {})
  );

  const renderTableRows = () => {
    const categories = [...new Set(items.map((item) => item.category))];
    const filteredItems = filter === "checked"
      ? items.filter((item) => checkedItems[item._id])
      : items.filter((item) => !checkedItems[item._id]);

    return categories.map((category, index) => {
      const translatedCategory = t(`shoppingList.categories.${category}`);

      const categoryItems = items.filter((item) => item.category === category);
      // Check if all items are checked only if 'unchecked' filter is selected
      const areAllItemsChecked = filter === "unchecked" && categoryItems.every((item) => checkedItems[item._id]);

      if (areAllItemsChecked) {
        return null;
      }

      

      return (<React.Fragment key={index}>
        <tr>
          <td className="category-cell">
          {t("shoppingList.itemCtg")}: {translatedCategory} ({filteredItems.filter((item) => item.category === category).length})
          </td>
          <td className="expand-cell">
            <button
              className={`expand-button ${visibleCategories.includes(category) ? "expanded" : ""}`}
              onClick={() => toggleCategoryVisibility(category)}
            >
              {visibleCategories.includes(category) ? "▼" : "►"} {t("shoppingList.expand")}
            </button>
          </td>
        </tr>
        {visibleCategories.includes(category) && (
          <React.Fragment>
            <tr>
              <th></th>
              <th>{t("shoppingList.itemName")}</th>
              <th>{t("shoppingList.itemQty")}</th>
            </tr>
            {filteredItems
              .filter((item) => item.category === category)
              .map((item) => (
                <tr key={item._id}>
                  <td>
                    <input
                      type="checkbox"
                      value={item._id}
                      checked={checkedItems[item._id]}
                      onChange={handleCheckboxChange}
                      className="checkbox"
                    />
                  </td>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                </tr>
              ))}
          </React.Fragment>
        )}
      </React.Fragment>
      );
    });
  };


  return (
    <>
      <div className={`table-header${selectedTheme}`}>
        <div className="header-content">
          <div className="tableName">
            <p className={`table-header-text${selectedTheme}`}>{shoppingList.shoppingListName}</p>
          </div>
          {canEdit && (
            <div className={`header-buttons${selectedTheme}`}>
              <button className="table-header-savechanges-button" onClick={handleUpdateList}>
              {t("shoppingList.saveChanges")}
              </button>
              <button
                className="table-header-button"
                onClick={() => navigate(hreflink)}
              >
                {t("shoppingList.edit")}
              </button>
            </div>
          )}
          <div className="filter-dropdown-wrapper">
            <select className="table-header-dropdown" id="filterDropdown" onChange={handleFilterChange} value={filter}>
              <option value="unchecked">{t("listViewer.unchecked")}</option>
              <option value="checked">{t("listViewer.checked")}</option>
            </select>
          </div>
        </div>
      </div>
      {renderDeletePrompt()}
      <table className={`table${selectedTheme}`}>
        <tbody>{renderTableRows()}</tbody>
      </table>
    </>

  );
};


const ShoppingList = ({ shoppingList, hreflink, canEdit }) => {
  const { userId } = useContext(UserContext);
  console.log(userId)
  const [t, i18n] = useTranslation("global")

  const isSharedWith = shoppingList.sharedTo.includes(userId);
  const isOwnerOrShared = userId === shoppingList.ownerId || shoppingList.sharedTo.includes(userId);

  if (shoppingList.isPublic || userId === shoppingList.ownerId || isSharedWith) {
    return (
      <div>
        <Table shoppingList={shoppingList} hreflink={hreflink} canEdit={isOwnerOrShared} />
      </div>
    );
  } else {
    return <div className="unauthorized">{t("errors.unauthorizedView")}</div>;
  }
};

export default ParentComponent;