import React, { useState } from "react";
import summaryApi from "../../Common";
import axios from "axios";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAllUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(summaryApi.getAllUser.url);
      setUsers(response.data.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">All Users</h2>
        <button
          onClick={handleAllUsers}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center"
          disabled={loading}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading...
            </>
          ) : (
            "View Users"
          )}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {Array.isArray(users) && users.length > 0 ? (
        <div className="bg-gray-50 rounded-lg overflow-hidden">
          <div className="grid grid-cols-3 gap-4 p-4 font-semibold text-gray-700 border-b border-gray-200">
            <div>Name</div>
            <div>Email</div>
          </div>
          <div className="divide-y divide-gray-200">
            {users.map((user, index) => (
              <div key={index} className="grid grid-cols-3 gap-4 p-4 hover:bg-gray-100 transition-colors duration-150">
                <div className="text-gray-800 font-medium">{user.name}</div>
                <div className="text-gray-600">{user.email}</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 bg-gray-50 rounded-lg text-center">
          {loading ? (
            <div className="text-gray-500">Loading users...</div>
          ) : (
            <>
              <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
              <p className="text-gray-600 mb-2">No users found</p>
              <p className="text-gray-500 text-sm">Click the "View Users" button to load users</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AllUsers;