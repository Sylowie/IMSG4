import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear the token from localStorage
    localStorage.removeItem('token');
    console.log('User logged out');

    // After logout, navigate to the LoginPage
    navigate('/login');
  }, [navigate]);

  return null;
};

export default Logout;
