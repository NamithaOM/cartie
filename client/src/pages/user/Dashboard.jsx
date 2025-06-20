import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "../../components/ProductCard";
import { useLocation } from "react-router";

const baseUrl = import.meta.env.VITE_BASE_URL;

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const token = sessionStorage.getItem("token");
  const location = useLocation();
const [suggestions, setSuggestions] = useState([]);

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // Extract search query params
  const queryParams = location.search;

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [queryParams]); // re-fetch when the query string changes

  const fetchProducts = async () => {
    try {
      let res;
      if (queryParams) {
        res = await axios.get(`${baseUrl}/api/products/search${queryParams}`, config);
      } else {
        res = await axios.get(`${baseUrl}/api/products`, config);
      }
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/categories`);
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

const user = JSON.parse(sessionStorage.getItem("user"));
const userId = user?.id;

const fetchSuggestions = async () => {
  try {
    const res = await axios.get(`${baseUrl}/api/products/suggestions/${userId}`, config);
    setSuggestions(res.data);
  } catch (err) {
    console.error("Error fetching suggestions:", err);
  }
};

useEffect(() => {
  fetchCategories();
  fetchProducts();
  if (userId) fetchSuggestions(); 
}, [queryParams]);


  return (
   <div className="container my-4 ">

  {/* Suggested Products Section */}
  {suggestions.length > 0 && (
    <div className="mb-5 p-4 border rounded shadow-sm bg-light">
      <h3 className="mb-4 text-primary">Suggested for You</h3>
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {suggestions.map((product, index) => (
          <div className="col d-flex" key={product._id}>
            <ProductCard
              name={product.name}
              price={product.price}
              dynamicPrice={product.dynamicPrice}
              description={product.description}
              imageUrl={`${baseUrl}/api/products/image/${product.image}`}
              productId={product._id}
              stock={product.stock}
              index={index + 1}
            />
          </div>
        ))}
      </div>
    </div>
  )}

  {/* All Products Section */}
  <div className="p-4 border rounded shadow-sm">
    <h2 className="mb-4 text-success">All Products</h2>

    {products.length === 0 ? (
      <p>No products found.</p>
    ) : (
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {products.map((product, index) => (
          <div className="col d-flex" key={product._id}>
            <ProductCard
              name={product.name}
              price={product.price}
              dynamicPrice={product.dynamicPrice}
              description={product.description}
              imageUrl={`${baseUrl}/api/products/image/${product.image}`}
              productId={product._id}
              stock={product.stock}
              index={index + 1}
            />
          </div>
        ))}
      </div>
    )}
  </div>

</div>

  );
}
