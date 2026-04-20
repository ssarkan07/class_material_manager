import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import FolderCard from '../components/FolderCard';
import AddSubjectCard from '../components/AddSubjectCard';
import AddSubjectModal from '../components/AddSubjectModal';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import UpdateFolderModal from '../components/UpdateFolderModal';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getYears, addSubject, deleteSubject, updateSubject } from '../api/index';

const Dashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'SY');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sync state with URL when tab changes
  useEffect(() => {
    setSearchParams({ tab: activeTab });
  }, [activeTab, setSearchParams]);

  // yearsData holds the full API response: [{ year_key, title, subtitle, subjects: [...] }]
  const [yearsData, setYearsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Delete modal state ───────────────────────────────────────────────────────
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, subjectId: null, name: '' });

  // ── Update (rename) modal state ──────────────────────────────────────────────
  const [updateModal, setUpdateModal] = useState({ isOpen: false, subjectId: null, name: '' });

  const navigate = useNavigate();

  // ── Fetch all years + subjects from the API ──────────────────────────────────
  const fetchYears = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getYears();
      setYearsData(data);
    } catch (err) {
      setError('Failed to load subjects. Make sure the backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchYears();
  }, [fetchYears]);

  // ── Derived state: find the active year object ───────────────────────────────
  const currentYear = yearsData.find((y) => y.year_key === activeTab);

  // ── Add new subject via API ──────────────────────────────────────────────────
  const handleSaveSubject = async (newSubjectName) => {
    try {
      await addSubject(activeTab, newSubjectName);
      await fetchYears();
    } catch (err) {
      console.error('Failed to add subject:', err);
      alert(`Error: ${err.message}`);
    }
  };

  // ── Delete subject ───────────────────────────────────────────────────────────
  const openDeleteModal = (subjectId, name) => {
    setDeleteModal({ isOpen: true, subjectId, name });
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteSubject(deleteModal.subjectId);
      setDeleteModal({ isOpen: false, subjectId: null, name: '' });
      await fetchYears();
    } catch (err) {
      console.error('Failed to delete subject:', err);
      alert(`Error: ${err.message}`);
    }
  };

  // ── Update (rename) subject ──────────────────────────────────────────────────
  const openUpdateModal = (subjectId, name) => {
    setUpdateModal({ isOpen: true, subjectId, name });
  };

  const handleSaveUpdate = async (newName) => {
    try {
      await updateSubject(updateModal.subjectId, newName);
      setUpdateModal({ isOpen: false, subjectId: null, name: '' });
      await fetchYears();
    } catch (err) {
      console.error('Failed to rename subject:', err);
      alert(`Error: ${err.message}`);
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="dashboard-container">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="main-content">
        <Header title="AIDS Department" />

        <div className="container-fluid p-4">
          {/* Header info for current tab */}
          <div className="mb-4">
            <small className="text-muted fw-bold text-uppercase">
              {currentYear?.subtitle ?? ''}
            </small>
            <h1 className="fw-bold mt-1 mb-5 display-4">
              {currentYear?.title ?? ''}
            </h1>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="d-flex align-items-center gap-2 text-muted">
              <div className="spinner-border spinner-border-sm" role="status" />
              <span>Loading subjects...</span>
            </div>
          )}

          {/* Error state */}
          {error && !loading && (
            <div className="alert alert-danger d-flex align-items-center gap-2">
              <i className="bi bi-exclamation-triangle-fill" />
              <span>{error}</span>
              <button className="btn btn-sm btn-outline-danger ms-auto" onClick={fetchYears}>
                Retry
              </button>
            </div>
          )}

          {/* Subject folder grid */}
          {!loading && !error && (
            <div className="row g-4">
              {(currentYear?.subjects ?? []).map((subject) => (
                <FolderCard
                  key={subject.id}
                  name={subject.name}
                  subjectId={subject.id}
                  onClick={() => navigate(`/files/${activeTab}/${subject.name}`)}
                  onDelete={openDeleteModal}
                  onUpdate={openUpdateModal}
                />
              ))}
              <AddSubjectCard onClick={() => setIsModalOpen(true)} />
            </div>
          )}
        </div>
      </main>

      {/* Add Subject Modal */}
      <AddSubjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveSubject}
      />

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        itemName={deleteModal.name}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteModal({ isOpen: false, subjectId: null, name: '' })}
      />

      {/* Update Folder Modal */}
      <UpdateFolderModal
        isOpen={updateModal.isOpen}
        currentName={updateModal.name}
        onSave={handleSaveUpdate}
        onClose={() => setUpdateModal({ isOpen: false, subjectId: null, name: '' })}
      />
    </div>
  );
};

export default Dashboard;
