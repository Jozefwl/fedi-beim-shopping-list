import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { default as HomePage } from './pages/HomePage';
import { default as ShoppingList } from './pages/ShoppingList';
import { default as NotFoundPage } from './pages/NoPage';

export const routes = () => {
    return(
        <Router>
            <Switch>
                <Route path="/" exact>
                    <HomePage />
                </Route>
                <Route path="/shoppinglist/:shoppingListId">
                    <ShoppingList />
                </Route>
                <Route>
                    <NotFoundPage />
                </Route>
            </Switch>
        </Router>
    )
}