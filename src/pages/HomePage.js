import { default as ShoppingListViewer } from '../components/ShoppingListViewer'
import "../styles/HomePage.css";
import shoppingListsData from "../data/shoppinglists.json"; // Importing the shopping lists

export default function Homepage({ username }) {

    // Sample shopping lists data (replace with actual data)
    const shoppingListsArray = Object.entries(shoppingListsData).reduce((acc, [key, value]) => {
        if (key !== "publicLists" && typeof value === "object") {
          acc.push({
            id: key,
            ...value,
            items: Object.entries(value.name).map(([itemId, itemName]) => ({
              id: itemId,
              name: itemName,
              category: value.category[itemId],
              quantity: value.quantity[itemId],
              checked: value.checked[itemId],
            })),
          });
        }
        return acc;
      }, []);

    return (
        <>
        <div className="homePage">
            <h1>Welcome to fedi-beim shopping list!</h1>
            <ShoppingListViewer
                shoppingLists={shoppingListsArray}
                username={username}
            />
            </div>
        </>
    )
}