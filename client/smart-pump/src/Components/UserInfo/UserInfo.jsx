import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './userInfo.css';
import axios from 'axios';

function UserInfo({ user, handleUpdateDetails, setUser, checkBalance, message }) {
  const [password, setPassword] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    handleUpdateDetails(e); 
  };

  const handleCheckBalance = () => {
    setShowModal(true);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setShowModal(false);
    checkBalance(password);
  };

  return (
    <div className="container user-info">
      <div className="card shadow-lg p-4">
        <h2 className="text-center mb-4 user-info-header">User Information</h2>
        <div className="row mb-3">
          <div className="col-md-6">
            <p><strong>ID:</strong> {user._id}</p>
          </div>
          <div className="col-md-6">
            <p><strong>GUID:</strong> {user.guid}</p>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-6">
            <p><strong>Active:</strong> {user.isActive ? 'Yes' : 'No'}</p>
          </div>
          <div className="col-md-6">
            <p className="balance"><strong>Balance:</strong> {'****'}</p>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-6">
            <p><strong>Age:</strong> {user.age}</p>
          </div>
          <div className="col-md-6">
            <p><strong>Eye Color:</strong> {user.eyeColor}</p>
          </div>
        </div>
        <div className="row mb-3 user-name-section">
          <div className="col-md-6">
            <p className="user-name"><strong>Name:</strong> {user.name.first} {user.name.last}</p>
          </div>
          <div className="col-md-6">
            <p><strong>Company:</strong> {user.company}</p>
          </div>
        </div>
        <div className="row mb-3 user-address-section">
          <div className="col-md-12">
            <p><strong>Address:</strong> {user.address}</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="update-form">
          <input
            type="text"
            placeholder="First Name"
            value={user.name?.first || ''}
            onChange={(e) => setUser({ ...user, name: { ...user.name, first: e.target.value } })}
          />
          <input
            type="text"
            placeholder="Last Name"
            value={user.name?.last || ''}
            onChange={(e) => setUser({ ...user, name: { ...user.name, last: e.target.value } })}
          />
          <input
            type="text"
            placeholder="Address"
            value={user.address || ''}
            onChange={(e) => setUser({ ...user, address: e.target.value })}
          />
          <button type="submit" className="btn btn-primary">Update Details</button>
        </form>
        <button onClick={handleCheckBalance} className="btn btn-secondary mt-3">Check Balance</button>
        <p className="mt-3">{message}</p>

        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <h4>Enter Password to Check Balance</h4>
              <form onSubmit={handlePasswordSubmit}>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit" className="btn btn-primary">Submit</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserInfo;