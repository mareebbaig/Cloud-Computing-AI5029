import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE_URL = 'http://localhost:3000';

function App() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [selectedNote, setSelectedNote] = useState(null);

  // Fetch all notes
  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/notes`);
      if (response.data.success) {
        setNotes(response.data.data);
        setError('');
      }
    } catch (err) {
      setError('Failed to fetch notes. Make sure the backend server is running on port 3000.');
      console.error('Error fetching notes:', err);
    } finally {
      setLoading(false);
    }
  };

  // Create a new note
  const createNote = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Both title and content are required');
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/notes`, {
        title: formData.title.trim(),
        content: formData.content.trim()
      });

      if (response.data.success) {
        setNotes([response.data.data, ...notes]);
        setFormData({ title: '', content: '' });
        setShowForm(false);
        setError('');
      }
    } catch (err) {
      setError('Failed to create note. Please try again.');
      console.error('Error creating note:', err);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // View note details
  const viewNote = async (noteId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/notes/${noteId}`);
      if (response.data.success) {
        setSelectedNote(response.data.data);
      }
    } catch (err) {
      setError('Failed to load note details');
      console.error('Error fetching note:', err);
    }
  };

  // Load notes on component mount
  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>📝 Notes Manager</h1>
        <p>Manage your notes with ease</p>
      </header>

      <main className="App-main">
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="actions">
          <button 
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : 'Add New Note'}
          </button>
          <button 
            className="btn btn-secondary"
            onClick={fetchNotes}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Refresh Notes'}
          </button>
        </div>

        {showForm && (
          <div className="note-form">
            <h3>Create New Note</h3>
            <form onSubmit={createNote}>
              <div className="form-group">
                <label htmlFor="title">Title:</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter note title"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="content">Content:</label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Enter note content"
                  rows="5"
                  required
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-success">
                  Create Note
                </button>
                <button 
                  type="button" 
                  className="btn btn-cancel"
                  onClick={() => {
                    setShowForm(false);
                    setFormData({ title: '', content: '' });
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="notes-container">
          <div className="notes-list">
            <h3>All Notes ({notes.length})</h3>
            {loading ? (
              <div className="loading">Loading notes...</div>
            ) : notes.length === 0 ? (
              <div className="no-notes">
                No notes found. Create your first note!
              </div>
            ) : (
              <div className="notes-grid">
                {notes.map((note) => (
                  <div 
                    key={note.id} 
                    className="note-card"
                    onClick={() => viewNote(note.id)}
                  >
                    <h4>{note.title}</h4>
                    <p className="note-preview">
                      {note.content.length > 100 
                        ? `${note.content.substring(0, 100)}...` 
                        : note.content}
                    </p>
                    <div className="note-meta">
                      <small>Created: {new Date(note.createdAt).toLocaleDateString()}</small>
                      {note.updatedAt !== note.createdAt && (
                        <small>Updated: {new Date(note.updatedAt).toLocaleDateString()}</small>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {selectedNote && (
            <div className="note-details">
              <div className="note-details-header">
                <h3>Note Details</h3>
                <button 
                  className="btn btn-close"
                  onClick={() => setSelectedNote(null)}
                >
                  ✕
                </button>
              </div>
              <div className="note-content">
                <h4>{selectedNote.title}</h4>
                <div className="note-body">
                  {selectedNote.content.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
                <div className="note-meta">
                  <p><strong>ID:</strong> {selectedNote.id}</p>
                  <p><strong>Created:</strong> {new Date(selectedNote.createdAt).toLocaleString()}</p>
                  <p><strong>Updated:</strong> {new Date(selectedNote.updatedAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
