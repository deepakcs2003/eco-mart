import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../Pages/Home";
import AboutPage from "../Pages/AboutPage";
import LoginPage from "../Pages/LoginPage";
import ContactPage from "../Pages/ContactPage";
import ProfilePage from "../Pages/ProfilePage";
import CategoriesPage from "../Pages/CategoriesPage";
import { Product } from "../Pages/Product";
import CreateCategory from "../Components/AdminDashboard/CreateCategory";
import AllUsers from "../Components/AdminDashboard/AllUsers";
import Dashboard from "../Components/AdminDashboard/Dashboard";
import Wishlist from "../Pages/Wishlist";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,  // App.js will wrap all child routes
    children: [
      { path: "/", element: <Home /> },  // ✅ Home Page
      { path: "about", element: <AboutPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "contact", element: <ContactPage /> },
      { path: "profile", element: <ProfilePage /> },
      { path: "categories", element: <CategoriesPage /> },
      { path: "product", element: <Product /> },
      { path: "createCategory", element: <CreateCategory /> },
      { path: "allUsers", element: <AllUsers /> },
      { path: "adminBoard", element: <Dashboard /> },
      { path: "wishlist", element: <Wishlist /> },
    ],
  },
]);

export default router;
