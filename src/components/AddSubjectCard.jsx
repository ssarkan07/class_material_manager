import React from 'react';

const AddSubjectCard = ({ onClick }) => {
  return (
    <div className="col-lg-3 col-md-4 col-sm-6 mb-4">
      <div className="add-subject-card" onClick={onClick}>
        <div className="add-icon">
          <i className="bi bi-plus"></i>
        </div>
        <div className="fw-bold">Add Subject</div>
      </div>
    </div>
  );
};

export default AddSubjectCard;
