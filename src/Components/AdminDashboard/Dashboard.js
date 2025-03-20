import { useState } from "react";
import AllUsers from "./AllUsers";
import CreateCategory from "./CreateCategory";
import CreateBranded from "./CreateBranded";

const Dashboard = () => {
  const [selectedComponent, setSelectedComponent] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6">
          <h2 className="text-3xl font-bold text-white">Dashboard</h2>
          <p className="text-blue-100 mt-2">Manage your users and categories and brands</p>
        </div>
        
        <div className="px-6 py-4 bg-gray-100 border-b">
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => setSelectedComponent("users")}
              className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center ${
                selectedComponent === "users"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              All Users
            </button>

            <button 
              onClick={() => setSelectedComponent("brandeds")}
              className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center ${
                selectedComponent === "brandeds"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              All Brandeds
            </button>
            
            <button 
              onClick={() => setSelectedComponent("category")}
              className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center ${
                selectedComponent === "category"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h4a2 2 0 012 2v4a2 2 0 01-2 2h-4a2 2 0 01-2-2V6zM4 16a2 2 0 100-4 2 2 0 000 4zm10-2a2 2 0 012-2h4a2 2 0 012 2v4a2 2 0 01-2 2h-4a2 2 0 01-2-2v-4z" clipRule="evenodd" />
              </svg>
              Create Category
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {selectedComponent ? (
            <>
              {selectedComponent === "users" && <AllUsers />}
              {selectedComponent === "category" && <CreateCategory />}
              {selectedComponent === "brandeds" && <CreateBranded/>}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <svg className="w-20 h-20 text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"></path>
              </svg>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">Welcome to your Dashboard</h3>
              <p className="text-gray-500 max-w-md">Select an option above to manage your users or create new categories and new brands</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;