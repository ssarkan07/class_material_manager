import React, { useState, useRef, useEffect } from 'react';

/**
 * FolderCard
 * Displays a subject folder. Has a ⋮ menu (top-right) with Delete and Update options.
 *
 * Props:
 *   name       {string}   - subject name displayed under the icon
 *   onClick    {function} - called when the card body is clicked (navigate to files)
 *   subjectId  {number}   - subject DB id, passed to onDelete/onUpdate
 *   onDelete   {function} - called with (subjectId) when Delete is chosen
 *   onUpdate   {function} - called with (subjectId, name) when Update is chosen
 */
const FolderCard = ({ name, onClick, subjectId, onDelete, onUpdate }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown when user clicks outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const handleMenuToggle = (e) => {
    e.stopPropagation(); // prevent card click
    setMenuOpen((prev) => !prev);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    setMenuOpen(false);
    onDelete?.(subjectId);
  };

  const handleUpdate = (e) => {
    e.stopPropagation();
    setMenuOpen(false);
    onUpdate?.(subjectId, name);
  };

  return (
    <div className="col-lg-3 col-md-4 col-sm-6 mb-4">
      <div className="subject-card-wrapper" ref={menuRef}>
        {/* ⋮ three-dot menu trigger */}
        <button
          className="card-menu-btn"
          onClick={handleMenuToggle}
          aria-label="Options"
          title="Options"
        >
          <i className="bi bi-three-dots-vertical"></i>
        </button>

        {/* Dropdown */}
        {menuOpen && (
          <div className="card-dropdown">
            <button className="card-dropdown-item" onClick={handleUpdate}>
              <i className="bi bi-pencil me-2"></i> Update
            </button>
            <button className="card-dropdown-item danger" onClick={handleDelete}>
              <i className="bi bi-trash3 me-2"></i> Delete
            </button>
          </div>
        )}

        {/* Card body */}
        <div className="subject-card" onClick={onClick}>
          <div className="folder-icon">
            <i className="bi bi-folder-fill"></i>
          </div>
          <div className="subject-name">{name}</div>
        </div>
      </div>
    </div>
  );
};

export default FolderCard;
