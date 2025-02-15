import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import LoginPage from "../Pages/LoginPage";
import ContactPage from "../Pages/ContactPage";
import ProfilePage from "../Pages/ProfilePage";
import CategoriesPage from "../Pages/CategoriesPage";
import { Product } from "../Pages/Product";

const router =createBrowserRouter([
    {
        path: "/",
        element: <App />,
    },
    {
        path:"login",
        element:<LoginPage></LoginPage>
    },
    {
        path: "product",
        element: <Product />,
    },
    {
        path:"contact",
        element:<ContactPage/>
    },
    {
        path:"profile",
        element:<ProfilePage/>
    },
    {
        path: "categories",
        element: <CategoriesPage />,
    },
    
    
])
export default router;
