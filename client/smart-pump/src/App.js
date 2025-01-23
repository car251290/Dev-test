import React, { useState } from 'react';
import axios from 'axios';
import UserInfo from './Components/UserInfo/UserInfo';
import Login from './Components/Login/Login';
import './App.css';

function App() {
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
        { headers: { Authorization: `Bearer ${token}` } } // Ensure token is correct
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
    <div className="App">
      {!user ? (
        <Login
          setUser={setUser}
          setToken={setToken}
          fetchUserDetails={fetchUserDetails}
        />
      ) : (
        <UserInfo
          user={user}
          handleUpdateDetails={handleUpdateDetails}
          setUser={setUser}
          checkBalance={checkBalance}
          message={message}
        />
      )}
    </div>
  );
}

export default App;