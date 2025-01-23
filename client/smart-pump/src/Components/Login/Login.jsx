import React, { useState } from 'react';
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css"; 
import './login.css'; 
import logo from '../../img/logo.png';

const Login = ({ setUser, setToken, fetchUserDetails }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/login', { email, password });
      setMessage(response.data.message);
      setToken(response.data.token);
      localStorage.setItem('token', response.data.token); // Store token in localStorage
      fetchUserDetails(response.data.token);
    } catch (error) {
      setMessage('Login failed');
    }
  };

  return (
    <div className="login-container d-flex justify-content-center align-items-center">
      <div className="card login-card shadow-lg p-4">
        <img src={logo} alt="Logo" className="logo mb-4" />
        <h1 className="text-center mb-4">Login:</h1>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email:
            </label>
            <input
              type="email"
              id="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password:
            </label>
            <input
              type="password"
              id="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
          <button type="button" className="btn btn-reset-password w-100">
            Reset Password
          </button>
        </form>
        <p className="text-center text-danger mt-3">{message}</p>
      </div>
    </div>
  );
};

export default Login;