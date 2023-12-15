import { default as ShoppingListViewer } from '../components/ShoppingListViewer'
import "../styles/HomePage.css";

//Translation
import { useTranslation } from "react-i18next";
// const [t, i18n] = useTranslation("global")
// {t("shoppingList.access")}

//-----

export default function Homepage({ token }) {
  const [t, i18n] = useTranslation("global");

  return (
    <>
      <div className="homePage">
        <h1>{t("homepage.welcome")}</h1>
        <ShoppingListViewer
          token={token}
        />
      </div>
    </>
  )
}