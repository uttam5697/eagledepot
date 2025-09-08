// context/UserContext.tsx
import { createContext, useContext, useState, useEffect } from "react";
import api from "../../lib/api";

interface UserContextType {
  firstName: string;
  lastName: string;
  fullName: string;
  authKey: string | null;
  isLoggedIn: boolean;
  login: (data: { firstName: string; lastName: string; authKey: string, fullName: string }) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [fullName, setFullName] = useState("");
  const [authKey, setAuthKey] = useState<string | null>(null);

  useEffect(() => {
    const storedKey = localStorage.getItem("authKey");
    const storedFirst = localStorage.getItem("firstName");
    const storedLast = localStorage.getItem("lastName");
    const fullName = `${storedFirst} ${storedLast}`;

    if (storedKey && storedFirst && storedLast && fullName) {
      setAuthKey(storedKey);
      setFirstName(storedFirst);
      setLastName(storedLast);
      setFullName(fullName);
    }
  }, []);

  const login = (data: { firstName: string; lastName: string; authKey: string, fullName: string }) => {
    setFirstName(data.firstName);
    setLastName(data.lastName);
    setAuthKey(data.authKey);
    setFullName(`${data.fullName}`);

    localStorage.setItem("firstName", data.firstName);
    localStorage.setItem("lastName", data.lastName);
    // localStorage.setItem("authKey", data.authKey);
    localStorage.setItem("fullName", data.fullName);
  };

  const logout = () => {
    setFirstName("");
    setLastName("");
    setFullName("");
    setAuthKey(null);
    handleLogout();

    localStorage.removeItem("firstName");
    localStorage.removeItem("lastName");
    localStorage.removeItem("authKey");
    localStorage.removeItem("fullName");
  };

  const handleLogout = async () => {
    await api.post('/userauth/logout', {}, {
      headers: {
        "auth_key": authKey
      }
    });
  };

  return (
    <UserContext.Provider
      value={{
        firstName,
        lastName,
        fullName,
        authKey,
        isLoggedIn: !!authKey,
        login,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};
