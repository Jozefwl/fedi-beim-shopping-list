import { default as ShoppingListViewer } from '../components/ShoppingListViewer'
import "../styles/HomePage.css";
import { Link } from 'react-router-dom';

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
        <div className="homePage">
            <h1>This is the home page</h1>
            <Link to={'/shoppinglist/1'}><button className="homeDemo">Press this button to view the first shopping list.</button></Link><br></br>
            <Link to={'/shoppinglist/2'}><button className="homeDemo">Press this button to view the second shopping list.</button></Link>
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