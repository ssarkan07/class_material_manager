import React, { useState, useEffect } from 'react';

/**
 * UpdateFolderModal
 * Modal with one input field to rename a subject/folder.
 *
 * Props:
 *   isOpen      {boolean}  - controls visibility
 *   currentName {string}   - pre-fills the rename field
 *   onSave      {function} - called with (newName: string) when user saves
 *   onClose     {function} - called when user closes/cancels
 */
const UpdateFolderModal = ({ isOpen, currentName, onSave, onClose }) => {
  const [name, setName] = useState('');

  // Sync the input whenever the modal opens or the subject changes
  useEffect(() => {
    if (isOpen) setName(currentName || '');
  }, [isOpen, currentName]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onSave(trimmed);
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
            <i className="bi bi-folder-fill text-warning me-2 fs-5"></i>
            <h2 className="modal-title">Rename Folder</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="folderRename">Folder Name</label>
              <input
                id="folderRename"
                type="text"
                className="form-input"
                placeholder="e.g. Machine Learning"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
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
              disabled={!name.trim()}
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

export default UpdateFolderModal;
