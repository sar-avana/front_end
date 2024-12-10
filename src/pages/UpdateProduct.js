import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { backendURL } from "./config";
import "./UpdateProduct.css";

function UpdateProduct() {
  const { id } = useParams(); // Get product ID from the URL
  const [product, setProduct] = useState({
    name: "",
    price: "",
    description: "",
    imageUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch product details on component mount
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`${backendURL}/products/${id}`);
        if (response.ok) {
          const data = await response.json();
          setProduct({
            name: data.name,
            price: data.price,
            description: data.description,
            imageUrl: data.imageUrl || "",
          });
        } else {
          setError("Failed to fetch product details.");
        }
      } catch (err) {
        setError("An error occurred while fetching product details.");
      }
    };

    fetchProductDetails();
  }, [id]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${backendURL}/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(product),
      });

      if (response.ok) {
        alert("Product updated successfully!");
        navigate(`/product/${id}`); // Redirect to the product details page
      } else {
        setError("Failed to update product.");
      }
    } catch (err) {
      setError("An error occurred while updating the product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="update-product-container">
      <h2>Update Product</h2>

      {error && <p className="error-message">{error}</p>}

      <form className="update-product-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Product Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={product.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="price">Price</label>
          <input
            type="number"
            id="price"
            name="price"
            value={product.price}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={product.description}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="imageUrl">Image URL</label>
          <input
            type="text"
            id="imageUrl"
            name="imageUrl"
            value={product.imageUrl}
            onChange={handleInputChange}
          />
        </div>

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "Updating..." : "Update Product"}
        </button>
      </form>
    </div>
  );
}

export default UpdateProduct;
