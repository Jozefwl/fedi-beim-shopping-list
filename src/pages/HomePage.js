import { default as ShoppingListViewer } from '../components/ShoppingListViewer'
import "../styles/HomePage.css";

export default function homepage() {
    // Sample shopping lists data (replace with actual data)
    const lists = [
        // ... lists data
    ];
    const sharedLists = [
        // ... shared lists data
    ];
    const archivedLists = [
        // ... archived lists data
    ];
    const publicLists = [
        // ... public lists data
    ];

    return (
        <>
        <div class="homePage">
            <h1>This is the home page</h1>
            <a href="shoppinglist/1"><button className="homeDemo">Press this button to view the first shopping list.</button></a><br></br>
            <a href="shoppinglist/2"><button className="homeDemo">Press this button to view the second shopping list.</button></a>
            <ShoppingListViewer
                lists={lists}
                sharedLists={sharedLists}
                archivedLists={archivedLists}
                publicLists={publicLists}
            />
            </div>
        </>
    )
}