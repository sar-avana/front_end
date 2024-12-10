import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ProductDetails.css';
import { backendURL } from './config';

function ProductDetails() {
  const { id } = useParams(); // Get the product ID from the URL
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false); // State to check if user is admin
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductDetails = async () => {
      const token = localStorage.getItem('authToken'); // Get the auth token from localStorage

      try {
        const response = await fetch(`${backendURL}/products/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProduct(data); // Set the fetched product details

          // Check if the user has admin role
          const roleResponse = await fetch(`${backendURL}/auth/role`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (roleResponse.ok) {
            const roleData = await roleResponse.json();
            setIsAdmin(roleData.role === 'admin'); // Update isAdmin if user is admin
          }
        } else {
          setError('Product not found or Unauthorized');
        }
      } catch (error) {
        setError('An error occurred while fetching the product details');
        console.error(error);
      }
    };

    fetchProductDetails();
  }, [id]);

  if (error) {
    return <div>{error}</div>;
  }

  const handleBackClick = () => {
    navigate('/');
  };

  const handleDelete = async () => {
    const token = localStorage.getItem('authToken');

    try {
      const response = await fetch(`${backendURL}/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert('Product deleted successfully');
        navigate('/'); // Redirect to home page after deletion
      } else {
        alert('Failed to delete product');
      }
    } catch (error) {
      alert('An error occurred while deleting the product');
      console.error(error);
    }
  };

  const handleUpdate = () => {
    navigate(`/update-product/${id}`); // Redirect to an update product page
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="product-details-container">
      <div className="product-details-content">
        <img src={product.imageUrl} alt={product.name} className="product-image" />
        <div className="product-info">
          <h1>{product.name}</h1>
          <p className="product-description">{product.description}</p>
          <p className="product-price">₹{product.price}</p>
          <p className="product-stock">Stock: {product.stockQuantity}</p>
          <button className="add-to-cart-button">Add to Cart</button>
          {isAdmin && (
            <div className="admin-actions">
              <button onClick={handleUpdate} className="update-button">Update Product</button>
              <button onClick={handleDelete} className="delete-button">Delete Product</button>
            </div>
          )}
        </div>
      </div>
      <button className="back-button" onClick={handleBackClick}>
        Back to Products
      </button>
    </div>
  );
}

export default ProductDetails;
