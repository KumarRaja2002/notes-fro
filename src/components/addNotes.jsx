import React, { useState, useEffect } from "react";
import "./NotesForm.css";

const NotesForm = ({ onSubmitSuccess, editNote }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Others",
  });

  const [message, setMessage] = useState("");

  const categories = ["Others", "Personal", "Work", "Study", "Miscellaneous"];

  useEffect(() => {
    if (editNote) {
      setFormData({
        title: editNote.title,
        description: editNote.description,
        category: editNote.category,
      });
    }
  }, [editNote]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = editNote ? "PATCH" : "POST"; 
    const url = editNote
      ? `https://notes-manager-2p3p.onrender.com/v1.0/notes/${editNote.id}` 
      : "https://notes-manager-2p3p.onrender.com/v1.0/notes"; 

    console.log("Submitting note with data:", formData); // Log form data

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();

      if (response.ok) {
        setMessage(editNote ? "Note updated successfully!" : "Note created successfully!");
        setFormData({ title: "", description: "", category: "Others" }); // Reset form
        onSubmitSuccess(); // Notify parent component
      } else {
        console.log("Error response data:", responseData); // Log the error response
        setMessage(`Error: ${responseData.message}`);
      }
    } catch (error) {
      console.error("Error during the request:", error); // Log the error
      setMessage("Failed to submit the note. Please try again later.");
    }
  };

  return (
    <div className="form-container">
      <h1 className="form-header">{editNote ? "Edit Note" : "Create a Note"}</h1>
      {message && <p className="form-message">{message}</p>}
      <form className="form" onSubmit={handleSubmit}>
        <label htmlFor="title">Title</label>
        <br />
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="form-input"
          required
        />
        <br />

        <label htmlFor="description">Description</label>
        <br />
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="form-textarea"
          rows="5"
          required
        />
        <br />

        <label htmlFor="category">Category</label>
        <br />
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="form-select"
          required
        >
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
        <br />

        <button type="submit" className="form-button">
          {editNote ? "Update" : "Create"} Note
        </button>
      </form>
    </div>
  );
};

export default NotesForm;
