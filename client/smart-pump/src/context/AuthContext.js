import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');
  const [message, setMessage] = useState('');

  const fetchUserDetails = async (token) => {
    try {
      const response = await axios.get('http://localhost:3000/user', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
    } catch (error) {
      setMessage('Failed to fetch user details');
    }
  };

  const handleUpdateDetails = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put('http://localhost:3000/user', user, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Failed to update user details');
    }
  };

  const checkBalance = async () => {
    const userPassword = prompt('Please enter your password:');
    if (!userPassword) {
      setMessage('Password is required to check the balance.');
      return;
    }
  
    try {
      const response = await axios.post(
        'http://localhost:3000/user/balance',
        { password: userPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      setMessage(`Your balance is $${response.data.balance}`);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setMessage('Invalid password or unauthorized.');
      } else {
        setMessage('Failed to check balance.');
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, message, setUser, setToken, fetchUserDetails, handleUpdateDetails, checkBalance }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);