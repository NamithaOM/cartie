import { Route, Routes } from "react-router";
import "./App.css";
import Home from "./pages/admin/Home";
import RootLayout from "./layout/RootLayout";
import Register from "./components/Register";
import Login from "./components/Login";
import { useEffect, useState } from "react";
import { AuthContext } from "./context/AuthContext";
import AdminLayout from "./layout/AdminLayout";
import CategoryPage from "./pages/admin/Category";
import Product from "./pages/admin/Product";
import UserLayout from "./layout/UserLayout";
import Dashboard from "./pages/user/Dashboard";
import Cart from "./pages/user/Cart";

function App() {
  const [user, setuser] = useState();
  useEffect(() => {
    const sessionUser = JSON.parse(sessionStorage.getItem("user"));
    setuser(sessionUser);
  }, []);
  return (
    <AuthContext.Provider value={{ user, setuser }}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />} />
        </Route> */}

        <Route path="/admin" element={<AdminLayout />}>
          <Route path="home" index element={<Home />} />
          <Route path="category" element={<CategoryPage />} />
          <Route path="products" element={<Product />} />
        </Route>

        <Route path="/user" element={<UserLayout />}>
          <Route path="dashboard" index element={<Dashboard />} />
          <Route path="cart" element={<Cart />} />
        </Route>

        {/* <Route path="concerts">
          <Route index element={<ConcertsHome />} />
          <Route path=":city" element={<City />} />
          <Route path="trending" element={<Trending />} />
        </Route> */}
      </Routes>
    </AuthContext.Provider>
  );
}

export default App;
