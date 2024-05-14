import React from 'react';
import './NavBar.css';

const NavBar = () => {
  return (
    <nav className="navbar">
      <div className="logo">MyLogo</div>
      <div className="search-bar">
        <input type="text" placeholder="Search..." />
      </div>
    </nav>
  );
};

export default NavBar;
