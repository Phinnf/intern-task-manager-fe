import { createContext, useContext } from "react";

const defaultAuth = {
  user: { name: "Long", email: "long@example.com" },
  login: async () => ({ success: true }),
  register: async () => ({ success: true }),
  logout: () => {},
};

const AuthContext = createContext(defaultAuth);

export const AuthProvider = ({ children }) => {
  return children;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
