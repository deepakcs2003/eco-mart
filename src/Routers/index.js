import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import LoginPage from "../Pages/LoginPage";
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
    }
    
    
])
export default router;
