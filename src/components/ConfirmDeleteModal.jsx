import React from 'react';

/**
 * ConfirmDeleteModal
 * A centered "Are you sure?" modal used by both FolderCard and FileCard.
 *
 * Props:
 *   isOpen    {boolean}  - controls visibility
 *   itemName  {string}   - name of the item being deleted (shown in message)
 *   onConfirm {function} - called when user clicks "Yes, Delete"
 *   onClose   {function} - called when user clicks "No, Cancel"
 */
const ConfirmDeleteModal = ({ isOpen, itemName, onConfirm, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content-custom confirm-delete-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <div className="confirm-delete-icon">
          <i className="bi bi-exclamation-triangle-fill"></i>
        </div>

        {/* Title */}
        <h2 className="modal-title text-center mb-2">Are you sure?</h2>

        {/* Message */}
        <p className="text-muted text-center mb-4">
          You are about to delete{' '}
          <strong className="text-dark">{itemName}</strong>. This action
          cannot be undone.
        </p>

        {/* Buttons */}
        <div className="modal-footer justify-content-center gap-3">
          <button className="btn-cancel" onClick={onClose}>
            No, Cancel
          </button>
          <button className="btn-delete-confirm" onClick={onConfirm}>
            <i className="bi bi-trash3 me-2"></i>
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
