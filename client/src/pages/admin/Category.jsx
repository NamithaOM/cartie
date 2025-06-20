import React, { useState, useEffect } from "react";
import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;

export default function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [messageColor, setMessageColor] = useState("green");

  // ✅ Get token from sessionStorage (since Login stores it there)
  const token = sessionStorage.getItem("token");

  // ✅ Config to reuse in requests
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/categories`);
      setCategories(res.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const payload = editingId ? { id: editingId, name } : { name };
      const res = await axios.post(`${baseUrl}/api/categories`, payload, config);

      const updatedCategory = res.data.category;
      if (editingId) {
        setCategories(categories.map((cat) => (cat._id === editingId ? updatedCategory : cat)));
        setMessage("Category updated successfully!");
      } else {
        setCategories([...categories, updatedCategory]);
        setMessage("Category added successfully!");
      }

      setName("");
      setEditingId(null);
      setMessageColor("green");
    } catch (error) {
      setMessage(error.response?.data?.message || "Operation failed");
      setMessageColor("red");
    }
  };

  const handleEdit = (cat) => {
    setName(cat.name);
    setEditingId(cat._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await axios.delete(`${baseUrl}/api/categories/${id}`, config);
        setCategories(categories.filter((cat) => cat._id !== id));
        setMessage("Category deleted");
        setMessageColor("green");
      } catch (error) {
        setMessage(error.response?.data?.message || "Delete failed");
        setMessageColor("red");
      }
    }
  };

  return (
    <>
      <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
        <h2>{editingId ? "Edit" : "Add"} Category</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
            <input
              type="text"
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter category name"
              style={{ flex: 1, padding: "8px" }}
            />
            <button
              className="btn btn-primary"
              type="submit"
              style={{ whiteSpace: "nowrap" }}
            >
              {editingId ? "Update" : "Add"}
            </button>
          </div>
        </form>

        {message && <p style={{ color: messageColor }}>{message}</p>}

        <hr />

        <h3>Category List</h3>
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Category Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat, index) => (
              <tr key={cat._id}>
                <td>{index + 1}</td>
                <td>{cat.name}</td>
                <td>
                  <button
                    onClick={() => handleEdit(cat)}
                    className="btn btn-sm btn-warning me-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(cat._id)}
                    className="btn btn-sm btn-danger"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center">
                  No categories
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
