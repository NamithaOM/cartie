import React, { useState, useEffect } from "react";
import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;

export default function Product() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    stock: "",
    image: null, // store the file object, not a string
  });

  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [messageColor, setMessageColor] = useState("green");
  const token = sessionStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // Fetch all products and categories
  const fetchProducts = async () => {
    const res = await axios.get(`${baseUrl}/api/products`, config);
    setProducts(res.data);
  };

  const fetchCategories = async () => {
    const res = await axios.get(`${baseUrl}/api/categories`);
    setCategories(res.data);
  };

  const fetchImage = async (image) => {
    console.log(image);
    const res = await axios.get(`${baseUrl}/api/products/image/${image}`);
    return `${baseUrl}/api/products/image/${image}`;
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // Submit form for create or update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("price", formData.price);
      data.append("description", formData.description);
      data.append("category", formData.category);
      data.append("stock", formData.stock);
      if (formData.image) data.append("file", formData.image); // file is the multer field

      if (editingId) data.append("id", editingId);

      const res = await axios.post(`${baseUrl}/api/products`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (editingId) {
        setProducts(
          products.map((p) => (p._id === editingId ? res.data.product : p))
        );
        setMessage("Product updated successfully!");
      } else {
        setProducts([...products, res.data.product]);
        setMessage("Product added successfully!");
      }

      setMessageColor("green");
      setEditingId(null);
      setFormData({
        name: "",
        price: "",
        description: "",
        category: "",
        stock: "",
        image: null,
      });
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong");
      setMessageColor("red");
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setFormData({
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category._id,
      stock: product.stock,
      image: product.image,
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`${baseUrl}/api/products/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ Required here too if delete is protected
          },
        });

        setProducts(products.filter((p) => p._id !== id));
        setMessage("Product deleted successfully!");
        setMessageColor("green");
      } catch (err) {
        setMessage(err.response?.data?.error || "Delete failed");
        setMessageColor("red");
      }
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "auto", padding: "20px" }}>
      <h2>{editingId ? "Edit Product" : "Add Product"}</h2>

      <form onSubmit={handleSubmit}>
        <div className="row mb-2">
          <div className="col">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="form-control"
              placeholder="Product Name"
            />
          </div>
          <div className="col">
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              className="form-control"
              placeholder="Price"
            />
          </div>
        </div>

        <div className="mb-2">
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="form-control"
            placeholder="Description"
          />
        </div>

        <div className="row mb-2">
          <div className="col">
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="form-control"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col">
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className="form-control"
              placeholder="Stock"
            />
          </div>
        </div>

        <div className="mb-2">
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <button className="btn btn-primary" type="submit">
            {editingId ? "Update" : "Add"} Product
          </button>
        </div>
      </form>

      {message && <p style={{ color: messageColor }}>{message}</p>}

      <hr />

      <h3>Product List</h3>
      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Price</th>
            <th>Category</th>
            <th>Stock</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
        
          {products.map((p, index) => {
            const imageUrl = `${baseUrl}/api/products/image/${p.image}`;
            return (
              <tr key={p._id}>
                <td>{index + 1}</td>
                <td>{p.name}</td>
                <td>₹{p.price}</td>
                <td>{p.category?.name}</td>
                <td>{p.stock}</td>
                <td>
                  <img
                    src={imageUrl}
                    alt="product"
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                    }}
                  />
                </td>
                <td>
                  <button
                    onClick={() => handleEdit(p)}
                    className="btn btn-sm btn-warning me-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="btn btn-sm btn-danger"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}

          {products.length === 0 && (
            <tr>
              <td colSpan="7" className="text-center">
                No products found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
