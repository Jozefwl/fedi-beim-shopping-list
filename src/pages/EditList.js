import React from "react";
import { useParams } from "react-router-dom";
import shoppingListsData from "../data/shoppinglists.json";

const ParentComponent = () => {
  const { id } = useParams();
  const shoppingListId = id; // No need to parse as an integer

  console.log("shoppingListsData:", shoppingListsData); // Log the imported data

  const shoppingList = shoppingListsData[shoppingListId];

  if (!shoppingList) {
    return <div>Shopping list not found</div>;
  }

  return (
    <div>
      <h1>{shoppingList.shoppingListName}</h1>
      {/* Render other details of the shopping list */}
    </div>
  );
};

export default ParentComponent;
