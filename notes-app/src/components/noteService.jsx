// Fetch all notes
export const fetchNotes = async () => {
  const response = await fetch("https://notes-manager-2p3p.onrender.com/v1.0/notes");
  if (!response.ok) {
    throw new Error("Failed to fetch notes");
  }
  const data = await response.json();
  return data.data; // Assuming the API response structure contains a "data" key
};

// Delete a note by ID
export const deleteNote = async (id) => {
  const response = await fetch(`https://notes-manager-2p3p.onrender.com/v1.0/notes/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete note");
  }
  return response.json();
};
