import React, { useEffect, useState } from "react";
import axios from "axios";
const baseUrl = import.meta.env.VITE_BASE_URL;

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
const user = JSON.parse(sessionStorage.getItem("user"));
const userId = user?.id;

  const fetchCart = async () => {
    const res = await axios.get(`${baseUrl}/api/cart/${userId}`);
    setCartItems(res.data);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <div className="container my-4">
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              <tr key={item._id}>
                <td>
                  <img
                    src={`${baseUrl}/api/products/image/${item.productId.image}`}
                    width="60"
                    height="60"
                    style={{ objectFit: "cover" }}
                  />
                </td>
                <td>{item.productId.name}</td>
                <td>₹{item.productId.price}</td>
                <td>{item.quantity}</td>
                <td>₹{item.productId.price * item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
