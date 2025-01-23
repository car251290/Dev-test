import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import UserInfo from './Components/UserInfo/UserInfo';
import Login from './Components/Login/Login';
import './App.css';

function App() {
  const { user, message } = useAuth();

  return (
    <div className="App">
      {!user ? (
        <Login />
      ) : (
        <UserInfo message={message} />
      )}
    </div>
  );
}

export default function AppWrapper() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}