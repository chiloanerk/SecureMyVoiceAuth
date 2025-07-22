import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function UserMenu() {
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null); // Ref for the menu container

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false); // Close menu after logout
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close the menu if clicked outside, but not on the button itself
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    // Cleanup the event listener when the component unmounts or isOpen changes
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]); // Re-run effect when isOpen changes

  return (
    <div className="user-menu-container" ref={menuRef}> {/* Attach ref to the container */}
      <button onClick={toggleMenu} className="user-menu-button">
        My Account
      </button>
      {isOpen && (
        <ul className="user-menu-dropdown">
          <li>
            <Link to="/profile" onClick={() => setIsOpen(false)}>Profile</Link>
          </li>
          <li>
            <Link to="/update-profile" onClick={() => setIsOpen(false)}>Update Profile</Link>
          </li>
          <li>
            <Link to="/history" onClick={() => setIsOpen(false)}>Login History</Link>
          </li>
          <li>
            <Link to="/sessions" onClick={() => setIsOpen(false)}>Active Sessions</Link>
          </li>
          <li>
            <Link to="/reset-password" onClick={() => setIsOpen(false)}>Change Password</Link>
          </li>
          <li>
            <button onClick={handleLogout} className="nav-link-button">Logout</button>
          </li>
        </ul>
      )}
    </div>
  );
}

export default UserMenu;