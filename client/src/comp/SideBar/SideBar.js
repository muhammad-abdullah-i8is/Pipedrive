import React from 'react';
import './SideBar.css';

const SideBar = ({ items, icons, onSelect, selectedItem }) => {
    return (
        <div className="sidebar">
            {items.map((item, index) => (
                <div key={index} className={`sidebar-item ${selectedItem === item ? 'selected' : ''}`}

                    onClick={() => onSelect(item)}>
                    {icons[index]}
                    {/* <span className="sidebar-text">{item}</span> */}
                </div>
            ))}
        </div>
    );
};

export default SideBar;
