import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router";

const baseUrl = import.meta.env.VITE_BASE_URL;

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [messageColor, setMessageColor] = useState("red");
  const navigate = useNavigate();
  const context = useContext(AuthContext);

  const users = context.user;

  useEffect(() => {
    if (users) {
      switch (users.role) {
        case "admin":
          navigate("/admin/home");
          break;
           case "user":
          navigate("/user/dashboard");
          break;
        default:
          break;
      }
    }
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${baseUrl}/api/auth/login`, formData);
      const result = res.data.user;
      context.setuser(result);
      sessionStorage.setItem("token", res.data.token);
      sessionStorage.setItem("user", JSON.stringify(result));
      setMessage("Login successful!");
      setMessageColor("green");
      // Redirect or navigate here (optional)
      if (result?.role === "admin") {
        navigate("/admin/home");
      }
       else if (result?.role === "user") {
        navigate("/user/dashboard");
      }
      else {
        navigate("/login");
      }
      // console.log(context);
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed");
      setMessageColor("red");
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: "400px", margin: "auto", padding: "20px" }}>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-control"
              placeholder="Email"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-control"
              placeholder="Password"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>
        {message && (
          <p style={{ color: messageColor, marginTop: "10px" }}>{message}</p>
        )}
      </div>
    </>
  );
}
