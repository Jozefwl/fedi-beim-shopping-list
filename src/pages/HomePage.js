import { default as ShoppingListViewer } from '../components/ShoppingListViewer'
import "../styles/HomePage.css";

export default function Homepage({ token }) {

  return (
    <>
      <div className="homePage">
        <h1>Welcome to fedi-beim shopping list!</h1>
        <ShoppingListViewer
          token={token}
        />
      </div>
    </>
  )
}