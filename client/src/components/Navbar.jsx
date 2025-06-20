import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { FaUserCircle, FaShoppingCart } from "react-icons/fa"; // ✅ Correct import

const baseUrl = import.meta.env.VITE_BASE_URL;

function Navbar() {
  const [searchTerm, setSearchTerm] = useState("");
  const { user, setuser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    setuser(null);
    navigate("/");
  };

  return (
    <nav className="navbar bg-body-tertiary">
      <div className="container-fluid d-flex flex-wrap justify-content-between align-items-center gap-2">
         <div className="d-flex align-items-center gap-2">
      <FaShoppingCart size={30} className="text-success" />
      <h1 className="fw-bold fs-3 m-0" style={{ color: "#ff5722", fontFamily: "'Fredoka', sans-serif" }}>
        Cartie
      </h1>
    </div>

        {/* Navigation Links - Only for logged-in users */}
        {user?.role === "admin" && (
          <div className="d-flex gap-3 align-items-center flex-wrap">
            <Link
              to={"/admin/products"}
              className="text-decoration-none text-secondary"
            >
              <p className="fw-bold fs-5 m-0">Product</p>
            </Link>
            <Link
              to={"/admin/category"}
              className="text-decoration-none text-secondary"
            >
              <p className="fw-bold fs-5 m-0">Category</p>
            </Link>
          </div>
        )}

        {user?.role === "user" && (
          <div className="d-flex gap-3 align-items-center flex-wrap">
            <Link
              to={"/user/dashboard"}
              className="text-decoration-none text-secondary"
            >
              <p className="fw-bold fs-5 m-0">Home</p>
            </Link>
            <Link
              to={"/user/cart"}
              className="text-decoration-none text-secondary"
            >
              <p className="fw-bold fs-5 m-0">Cart</p>
            </Link>
          </div>
        )}

        {/* Search Box - Only for logged-in users with user role */}
        {user?.role === "user" && (
          <form
            className="d-flex align-items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (searchTerm.trim()) {
                navigate(`/user/dashboard?q=${searchTerm}`);
              }
            }}
          >
            <input
              type="text"
              className="form-control"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-outline-success" type="submit">
              Search
            </button>
          </form>
        )}

        {/* User Dropdown */}
        <div className="dropdown pe-4">
          <button
            className="btn btn-light dropdown-toggle d-flex align-items-center"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <FaUserCircle size={24} className="me-2" />
            {user ? user.name : "Account"}
          </button>
          <ul className="dropdown-menu dropdown-menu-end">
            {!user ? (
              <>
                <li>
                  <Link to="/" className="dropdown-item">
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="dropdown-item">
                    Sign Up
                  </Link>
                </li>
              </>
            ) : (
              <li>
                <button onClick={handleLogout} className="dropdown-item">
                  Log Out
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
