import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import AboutPage from "../Pages/AboutPage"
import LoginPage from "../Pages/LoginPage";
import { Product } from "../Pages/Product";
import ContactPage from "../Pages/ContactPage";
import ProfilePage from "../Pages/ProfilePage";

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
        path : "about",
        element:<AboutPage></AboutPage>
    }
    
    
])
export default router;
