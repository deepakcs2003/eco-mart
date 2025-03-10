import { createContext, useContext, useState } from "react";

// Creating User Context
const UserContext = createContext();

// Custom Hook to use User Context
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Store user data

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
