import React from "react";
import { ToastContainer } from "react-toastify";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import { Outlet } from "react-router-dom";
import { WishlistProvider } from "./Context/WishlistContext";

function App() {
  return (
    <WishlistProvider>
      <div className="flex flex-col min-h-screen">
        <ToastContainer />
        <Header />
        <main className="flex-grow overflow-hidden pt-14">
          <Outlet />
        </main>
        <Footer />
      </div>
    </WishlistProvider>
  );
}

export default App;
