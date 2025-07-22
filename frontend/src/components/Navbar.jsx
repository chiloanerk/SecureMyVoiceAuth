import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UserMenu from './UserMenu'; // Import the new UserMenu component

function Navbar() {
  const { accessToken } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">SecureMyVoice</Link>
      </div>
      <ul className="navbar-nav">
        <li>
          <Link to="/">Home</Link>
        </li>
        {!accessToken ? (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/signup">Sign Up</Link>
            </li>
          </>
        ) : (
          <li>
            <UserMenu /> {/* Render the UserMenu component */}
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;