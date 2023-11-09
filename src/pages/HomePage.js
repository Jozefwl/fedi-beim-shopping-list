import { default as ShoppingListViewer } from '../components/ShoppingListViewer'

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
            <h1>This is the home page</h1>
            <a href="shoppinglist/1"><button>View a singular shopping list</button></a>
            <ShoppingListViewer
                lists={lists}
                sharedLists={sharedLists}
                archivedLists={archivedLists}
                publicLists={publicLists}
            />
        </>
    )
}