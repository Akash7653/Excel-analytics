import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('excelProUser');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const register = async (userData) => {
    await axios.post('https://excel-analytics-dg30.onrender.com/api/auth/register', userData);
  };

  const login = async ({ email, password }) => {
    const res = await axios.post('https://excel-analytics-dg30.onrender.com/api/auth/login', { email, password },
    {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const { token, user } = res.data;

    // Save token and user to localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('excelProUser', JSON.stringify(user));

    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('excelProUser');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
