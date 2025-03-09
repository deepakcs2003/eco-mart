import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import AboutPage from "../Pages/AboutPage";
import LoginPage from "../Pages/LoginPage";
import ContactPage from "../Pages/ContactPage";
import ProfilePage from "../Pages/ProfilePage";
import CategoriesPage from "../Pages/CategoriesPage";
import { Product } from "../Pages/Product";
import CreateCategory from "../Components/AdminDashboard/CreateCategory";
import AllUsers from "../Components/AdminDashboard/AllUsers";
import Dashboard from "../Components/AdminDashboard/Dashboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,  // App.js wraps all pages
    children: [
      { path: "about", element: <AboutPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "contact", element: <ContactPage /> },
      { path: "profile", element: <ProfilePage /> },
      { path: "categories", element: <CategoriesPage /> },
      { path: "product", element: <Product />,},
      { path: "createCategory",element:<CreateCategory/>},
      { path: "allUsers" , element:<AllUsers/>},
      { path: "adminBoard", element:<Dashboard/>}
    ],
  },
]);

export default router;
