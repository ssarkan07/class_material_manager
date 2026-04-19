import React, { useState, useEffect } from 'react';

/**
 * UpdateFileModal
 * Modal with two input fields to rename a file and update its URL.
 *
 * Props:
 *   isOpen      {boolean}  - controls visibility
 *   currentName {string}   - pre-fills the name field
 *   currentUrl  {string}   - pre-fills the URL field
 *   onSave      {function} - called with ({ name, link }) when user saves
 *   onClose     {function} - called when user closes/cancels
 */
const UpdateFileModal = ({ isOpen, currentName, currentUrl, onSave, onClose }) => {
  const [name, setName] = useState('');
  const [link, setLink] = useState('');

  // Sync inputs whenever the modal opens or the file changes
  useEffect(() => {
    if (isOpen) {
      setName(currentName || '');
      setLink(currentUrl || '');
    }
  }, [isOpen, currentName, currentUrl]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedLink = link.trim();
    if (!trimmedName || !trimmedLink) return;
    onSave({ name: trimmedName, link: trimmedLink });
  };



  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content-custom"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div className="modal-icon-header">
            <i className="bi bi-file-earmark-pdf-fill text-danger me-2 fs-5"></i>
            <h2 className="modal-title">Update File</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Rename */}
            <div className="form-group mb-3">
              <label htmlFor="fileRename">File Name</label>
              <input
                id="fileRename"
                type="text"
                className="form-input"
                placeholder="e.g. Unit 1 - Introduction"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </div>

            {/* URL */}
            <div className="form-group">
              <label htmlFor="fileUrl">File URL</label>
              <input
                id="fileUrl"
                type="url"
                className="form-input"
                placeholder="https://drive.google.com/..."
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn-save"
              disabled={!name.trim() || !link.trim()}
            >
              <i className="bi bi-check2 me-1"></i>
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateFileModal;
