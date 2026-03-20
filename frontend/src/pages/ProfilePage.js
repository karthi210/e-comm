import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './ProfilePage.css';

function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    
    setLoading(true);
    setMessage('');
    
    const updateData = { name, email };
    if (password) {
      updateData.password = password;
    }
    
    const result = await updateProfile(updateData);
    
    if (result.success) {
      setMessage('Profile updated successfully!');
      setPassword('');
      setConfirmPassword('');
    } else {
      setMessage(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h2>My Profile</h2>
        
        {message && (
          <div className={message.includes('success') ? 'success-message' : 'error-message'}>
            {message}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label>New Password (leave blank to keep current)</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label>Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          
          <button type="submit" className="update-btn" disabled={loading}>
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProfilePage;