import React from "react";
import axios from "axios";
const baseUrl = import.meta.env.VITE_BASE_URL;

function ProductCard({
  name,
  price,
  dynamicPrice,
  description,
  imageUrl,
  productId,
  fetchCart,
  index,
  stock,
}) {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const userId = user?.id;

  const handleAddToCart = async () => {
    try {
      await axios.post(`${baseUrl}/api/cart/add`, {
        userId,
        productId,
        quantity: 1,
      });
      alert("Added to cart");
      if (fetchCart) fetchCart();
    } catch (err) {
      console.error("Add to cart error:", err);
    }
  };

  return (
    <div
      className="card h-100 shadow-sm"
      style={{ width: "100%", maxWidth: "300px" }}
    >
      <img
        src={imageUrl}
        className="card-img-top"
        alt={name}
        style={{ height: "200px", objectFit: "cover" }}
      />
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 className="card-title m-0">
            {name} 
          </h5>
          <div className="text-end">
            {dynamicPrice !== price ? (
              <>
                <div className="text-muted text-decoration-line-through small">
                  ₹{price}
                </div>
                <div className="fw-bold text-success">₹{dynamicPrice}</div>
              </>
            ) : (
              <div className="fw-bold">₹{price}</div>
            )}
          </div>
        </div>

        <p className="card-text flex-grow-1 ">{description}</p>
        <div className="mt-1 mb-1 text-muted small text-left">
          In Stock: <strong>{stock}</strong>
        </div>
        <button onClick={handleAddToCart} className="btn btn-primary mt-auto">
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
