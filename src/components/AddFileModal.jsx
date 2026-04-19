import React, { useState } from 'react';

const AddFileModal = ({ isOpen, onClose, onSave }) => {
  const [sectionTitle, setSectionTitle] = useState('Unit wise PPT');
  const [fileName, setFileName] = useState('');
  const [fileLink, setFileLink] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    if (fileName.trim() && fileLink.trim()) {
      onSave({
        section: sectionTitle,
        name: fileName.trim(),
        link: fileLink.trim()
      });
      setFileName('');
      setFileLink('');
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content-custom" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h5 className="modal-title">Add Material</h5>
        </div>
        <div className="modal-body">
          <div className="form-group mb-3">
            <label htmlFor="sectionSelect">Section</label>
            <select
              id="sectionSelect"
              className="form-input"
              value={sectionTitle}
              onChange={(e) => setSectionTitle(e.target.value)}
            >
              <option value="Unit wise PPT">Unit wise PPT</option>
              <option value="CIE">CIE</option>
              <option value="Examination">Examination</option>
              <option value="Syllabus">Syllabus</option>
            </select>
          </div>
          <div className="form-group mb-3">
            <label htmlFor="fileName">File Name</label>
            <input
              type="text"
              id="fileName"
              className="form-input"
              placeholder="e.g. Unit 1 Introduction.pdf"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="fileLink">Enter the Link</label>
            <input
              type="url"
              id="fileLink"
              className="form-input"
              placeholder="https://drive.google.com/..."
              value={fileLink}
              onChange={(e) => setFileLink(e.target.value)}
            />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-save" onClick={handleSave}>
            Save File
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddFileModal;
