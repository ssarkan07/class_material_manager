import React from 'react';

const Sidebar = ({ activeTab, onTabChange }) => {
  const navItems = [
    { id: 'SY', label: 'SY', icon: 'bi-mortarboard' },
    { id: 'TY', label: 'TY', icon: 'bi-window' },
    { id: 'BY', label: 'BY', icon: 'bi-award' },
  ];

  return (
    <div className="sidebar">
      <div className="logo-section">
        <div className="logo-icon">
          <i className="bi bi-bar-chart-fill"></i>
        </div>
        <div className="logo-text">
          <h6 className="mb-0">CLASS MANAGER</h6>
          <small>ACADEMIC CURATOR</small>
        </div>
      </div>

      <div className="mt-4">
        {navItems.map((item) => (
          <a
            key={item.id}
            href="#"
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              onTabChange(item.id);
            }}
          >
            <i className={`bi ${item.icon}`}></i>
            <span>{item.label}</span>
          </a>
        ))}
      </div>


      <a href="#" className="logout-link">
        <i className="bi bi-box-arrow-left"></i> Logout
      </a>
    </div>
  );
};

export default Sidebar;
