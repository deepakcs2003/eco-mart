import React from "react";
import { ToastContainer } from "react-toastify";
import { Outlet } from "react-router-dom";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import { WishlistProvider } from "./Context/WishlistContext";

function App() {
  return (
    <WishlistProvider>
      <div className="flex flex-col min-h-screen">
        <ToastContainer />
        <Header />
        <main className="flex-grow overflow-hidden pt-16 bg-[#F5DEB3]">
          <Outlet /> {/* This will render the nested routes dynamically */}
        </main>
        <Footer />
      </div>
    </WishlistProvider>
  );
}

export default App;
