import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import FileCard from '../components/FileCard';
import AddFileModal from '../components/AddFileModal';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import UpdateFileModal from '../components/UpdateFileModal';
import { getSubjectSections, addFile, deleteFile, updateFile } from '../api/index';

const FilesLink = () => {
  const { yearKey: urlYearKey, subject } = useParams();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sectionsData, setSectionsData] = useState([]);
  const [subjectId, setSubjectId] = useState(null);
  const [yearKey, setYearKey] = useState(urlYearKey || 'SY');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Delete modal state ───────────────────────────────────────────────────────
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, fileId: null, name: '' });

  // ── Update modal state ───────────────────────────────────────────────────────
  const [updateModal, setUpdateModal] = useState({ isOpen: false, fileId: null, name: '', url: '' });

  // ── Fetch all sections + files for this subject from the API ─────────────────
  const fetchSections = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSubjectSections(subject);
      setSectionsData(data.sections);
      setSubjectId(data.subject_id);
      setYearKey(data.year_key);
    } catch (err) {
      setError(`Failed to load files for "${subject}". Make sure the backend is running.`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [subject]);

  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

  // ── Add a new file to a section via API ─────────────────────────────────────
  const handleSaveFile = async (fileInfo) => {
    const targetSection = sectionsData.find((s) => s.title === fileInfo.section);
    if (!targetSection) {
      alert(`Section "${fileInfo.section}" not found.`);
      return;
    }
    try {
      await addFile(targetSection.id, {
        name: fileInfo.name,
        link: fileInfo.link,
        subject_id: subjectId,
      });
      await fetchSections();
    } catch (err) {
      console.error('Failed to add file:', err);
      alert(`Error: ${err.message}`);
    }
  };

  // ── Delete file ──────────────────────────────────────────────────────────────
  const openDeleteModal = (fileId, name) => {
    setDeleteModal({ isOpen: true, fileId, name });
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteFile(deleteModal.fileId);
      setDeleteModal({ isOpen: false, fileId: null, name: '' });
      await fetchSections();
    } catch (err) {
      console.error('Failed to delete file:', err);
      alert(`Error: ${err.message}`);
    }
  };

  // ── Update file ──────────────────────────────────────────────────────────────
  const openUpdateModal = (fileId, name, url) => {
    setUpdateModal({ isOpen: true, fileId, name, url });
  };

  const handleSaveUpdate = async ({ name, link }) => {
    try {
      await updateFile(updateModal.fileId, { name, link });
      setUpdateModal({ isOpen: false, fileId: null, name: '', url: '' });
      await fetchSections();
    } catch (err) {
      console.error('Failed to update file:', err);
      alert(`Error: ${err.message}`);
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="dashboard-container">
      <Sidebar activeTab={yearKey} onTabChange={(id) => navigate(`/?tab=${id}`)} />

      <main className="main-content">
        <Header title="AIDS Department" />

        <div className="container-fluid p-4">
          {/* Back link + page title */}
          <div className="mb-4">
            <Link to="/" className="text-decoration-none d-flex align-items-center gap-2 mb-2">
              <i className="bi bi-arrow-left"></i>
              Back to Dashboard
            </Link>

            <div className="d-flex justify-content-between align-items-end">
              <div>
                <small className="text-muted fw-bold text-uppercase">COURSE MATERIALS</small>
                <h1 className="fw-bold mt-1 display-4">{subject} Files</h1>
              </div>
              <button
                className="btn-add-material mb-2"
                onClick={() => setIsModalOpen(true)}
                disabled={loading}
              >
                <i className="bi bi-plus-lg"></i>
                Add Material
              </button>
            </div>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="d-flex align-items-center gap-2 text-muted">
              <div className="spinner-border spinner-border-sm" role="status" />
              <span>Loading files...</span>
            </div>
          )}

          {/* Error state */}
          {error && !loading && (
            <div className="alert alert-danger d-flex align-items-center gap-2">
              <i className="bi bi-exclamation-triangle-fill" />
              <span>{error}</span>
              <button className="btn btn-sm btn-outline-danger ms-auto" onClick={fetchSections}>
                Retry
              </button>
            </div>
          )}

          {/* Sections + file cards */}
          {!loading && !error && (
            <>
              {sectionsData.length === 0 ? (
                <p className="text-muted">
                  No materials uploaded yet. Click "Add Material" to get started.
                </p>
              ) : (
                sectionsData.map((section) => (
                  <div key={section.id} className="mb-5">
                    <h3 className="fw-bold mb-4 border-start border-primary border-4 ps-3">
                      {section.title}
                    </h3>
                    <div className="row g-3">
                      {section.files.length === 0 ? (
                        <p className="text-muted ps-2">No files in this section yet.</p>
                      ) : (
                        section.files.map((file) => (
                          <FileCard
                            key={file.id}
                            name={file.name}
                            size={file.size}
                            url={file.link}
                            fileId={file.id}
                            onDelete={openDeleteModal}
                            onUpdate={openUpdateModal}
                          />
                        ))
                      )}
                    </div>
                  </div>
                ))
              )}
            </>
          )}
        </div>
      </main>

      {/* Add File Modal */}
      <AddFileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveFile}
      />

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        itemName={deleteModal.name}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteModal({ isOpen: false, fileId: null, name: '' })}
      />

      {/* Update File Modal */}
      <UpdateFileModal
        isOpen={updateModal.isOpen}
        currentName={updateModal.name}
        currentUrl={updateModal.url}
        onSave={handleSaveUpdate}
        onClose={() => setUpdateModal({ isOpen: false, fileId: null, name: '', url: '' })}
      />
    </div>
  );
};

export default FilesLink;
