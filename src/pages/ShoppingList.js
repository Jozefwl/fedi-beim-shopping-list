import React from "react";

const ShoppingList = ({ match }) => {
  const { id } = match.params;

  return (
    <div>
      <h1>Shopping List {id}</h1>
      <ul>
        <li>Item 1</li>
        <li>Item 2</li>
        <li>Item 3</li>
      </ul>
    </div>
  );
};

export default ShoppingList;