import React, { useState, useEffect } from "react";
import "./NotesPage.css";
import NotesForm from "./addNotes"; // Import NotesForm component

const notesDetails = "https://notes-manager-2p3p.onrender.com/v1.0/notes";

const NotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [editNote, setEditNote] = useState(null);
  const [viewNote, setViewNote] = useState(null); // State for the note being viewed

  const notesHandler = async () => {
    try {
      const response = await fetch(notesDetails);
      const { data } = await response.json();
      setNotes(data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  useEffect(() => {
    notesHandler();
  }, []);

  const toggleForm = () => {
    setShowForm((prev) => !prev);
    setEditNote(null); // Reset edit state when toggling form
  };

  const onFormSubmit = async (updatedNote) => {
    if (editNote) {
      try {
        const response = await fetch(
          `https://notes-manager-2p3p.onrender.com/v1.0/notes/${updatedNote.id}`,
          {
            method: "PATCH", // Use PUT for updating the note
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedNote),
          }
        );

        if (response.ok) {
          setMessage("Note updated successfully!");
          notesHandler(); // Refresh the notes list after updating
          setShowForm(false); // Close the form
          setTimeout(() => setMessage(""), 3000); // Clear the success message after 3 seconds
        } else {
          const errorData = await response.json();
          setMessage(`Error: ${errorData.message}`);
        }
      } catch (error) {
        console.error("Error updating note:", error);
      }
    } else {
      // Handle adding a new note if editNote is null (This part stays the same)
      setMessage("Note added successfully!");
      setShowForm(false); // Close the form
      notesHandler(); // Refresh the notes list
      setTimeout(() => setMessage(""), 3000); // Clear the success message after 3 seconds
    }
  };

  const handleEdit = (note) => {
    setEditNote(note); // Set note to edit
    setShowForm(true); // Show form for editing
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `https://notes-manager-2p3p.onrender.com/v1.0/notes/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setMessage("Note deleted successfully!");
        notesHandler(); // Refresh the notes list after deletion
        setTimeout(() => setMessage(""), 3000);
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error deleting note:", error);
      setMessage("Failed to delete the note. Please try again.");
    }
  };

  const handleView = (note) => {
    setViewNote(note); // Set note to view
  };

  return (
    <div className="container">
      <div className="header-container">
        <h1 className="header">Notes Page</h1>
        <button className="add-note-button" onClick={toggleForm}>
          {editNote ? "Edit Note" : "Add Note"}
        </button>
      </div>
      {message && <p className="success-message">{message}</p>}
      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <NotesForm onSubmitSuccess={onFormSubmit} editNote={editNote} />
            <button className="close-button" onClick={toggleForm}>
              X
            </button>
          </div>
        </div>
      )}
      {viewNote && (
        <div className="modal">
          <div className="modal-content">
            <h2>Note Details</h2>
            <p><strong>Title:</strong> {viewNote.title}</p>
            <p><strong>Description:</strong> {viewNote.description}</p>
            <p><strong>Category:</strong> {viewNote.category}</p>
            <p><strong>Created At:</strong> {new Date(viewNote.created_at).toLocaleString()}</p>
            <p><strong>Updated At:</strong> {new Date(viewNote.updated_at).toLocaleString()}</p>
            <button className="close-button" onClick={() => setViewNote(null)}>
              Close
            </button>
          </div>
        </div>
      )}
      {notes.length > 0 ? (
        <table className="table">
          <thead>
            <tr>
              <th className="th">ID</th>
              <th className="th">Title</th>
              <th className="th">Category</th>
              <th className="th">Actions</th>
            </tr>
          </thead>
          <tbody>
            {notes.map((note) => (
              <tr key={note.id}>
                <td className="td">{note.id}</td>
                <td className="td">{note.title}</td>
                <td className="td">{note.category}</td>
                <td className="td">
                  <button onClick={() => handleEdit(note)}>Edit</button>
                  <button onClick={() => handleView(note)}>View</button>
                  <button onClick={() => handleDelete(note.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="noData">No notes available</p>
      )}
    </div>
  );
};

export default NotesPage;
