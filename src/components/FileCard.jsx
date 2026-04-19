import React, { useState, useRef, useEffect } from 'react';

/**
 * FileCard
 * Displays a file link card. Has a ⋮ menu (top-right) with Delete and Update options.
 *
 * Props:
 *   name      {string}   - file name
 *   size      {string}   - file size string (optional)
 *   url       {string}   - link opened on card click
 *   fileId    {number}   - file DB id, passed to onDelete/onUpdate
 *   onDelete  {function} - called with (fileId) when Delete is chosen
 *   onUpdate  {function} - called with (fileId, name, url) when Update is chosen
 */
const FileCard = ({ name, size, url, fileId, onDelete, onUpdate }) => {
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
    e.stopPropagation();
    setMenuOpen((prev) => !prev);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    setMenuOpen(false);
    onDelete?.(fileId);
  };

  const handleUpdate = (e) => {
    e.stopPropagation();
    setMenuOpen(false);
    onUpdate?.(fileId, name, url);
  };

  return (
    <div className="col-lg-3 col-md-4 col-sm-6 mb-3">
      <div className="file-card-wrapper" ref={menuRef}>
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
        <div
          className="file-card p-3 border rounded bg-white shadow-sm d-flex align-items-center gap-3"
          onClick={() => window.open(url || 'https://www.google.com', '_blank')}
          style={{ cursor: 'pointer', transition: 'all 0.2s' }}
        >
          <div className="file-icon text-danger fs-3">
            <i className="bi bi-file-earmark-pdf-fill"></i>
          </div>
          <div className="file-info overflow-hidden">
            <div className="fw-bold text-truncate" title={name}>{name}</div>
            <small className="text-muted">{size || '1.2 MB'}</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileCard;
