import React, { useState } from 'react';

const AddSubjectModal = ({ isOpen, onClose, onSave }) => {
  const [subjectName, setSubjectName] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    if (subjectName.trim()) {
      onSave(subjectName.trim());
      setSubjectName('');
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content-custom" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h5 className="modal-title">Add Subject</h5>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label htmlFor="subjectName">Subject Name</label>
            <input
              type="text"
              id="subjectName"
              className="form-input"
              placeholder="Enter the Subject Name"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              autoFocus
            />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-save" onClick={handleSave}>
            Save Subject
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSubjectModal;
