import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import { backendURL } from "./config";

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // Track if user is admin
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [cartCount, setCartCount] = useState(0); // State for cart count
  const [cartItems, setCartItems] = useState({}); // State for individual cart items
  const navigate = useNavigate();

  // Check login status and user role on component load
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token); // Set to true if token exists
    if (token) {
      fetchUserRole(token); // Fetch user role
    }
    fetchCartCount(); // Fetch cart count on page load
    fetchCartItems(); // Fetch cart items on page load
  }, []);

  // Fetch user role
  const fetchUserRole = async (token) => {
    try {
      const response = await fetch(`${backendURL}/auth/role`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setIsAdmin(data.role === "admin");
      } else {
        console.error("Failed to fetch user role.");
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
    }
  };

  // Fetch cart count
  const fetchCartCount = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      const response = await fetch(`${backendURL}/cart`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const totalCount = data.items.reduce((acc, item) => acc + item.quantity, 0);
        setCartCount(totalCount);
      } else {
        console.error("Failed to fetch cart count.");
      }
    } catch (error) {
      console.error("Error fetching cart count:", error);
    }
  };

  // Fetch cart items
  const fetchCartItems = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      const response = await fetch(`${backendURL}/cart`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const itemsMap = {};
        data.items.forEach((item) => {
          itemsMap[item.product._id] = item.quantity;
        });
        setCartItems(itemsMap);
      } else {
        console.error("Failed to fetch cart items.");
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Clear auth token
    setIsLoggedIn(false); // Update login state
    setIsAdmin(false); // Reset admin state
    navigate("/"); // Redirect to home page
  };

  // Fetch products based on search query
  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${backendURL}/products?query=${searchQuery}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        console.error("Failed to fetch products: Unauthorized");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Add product to cart
  const handleAddToCart = async (productId) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("Please log in to add items to the cart.");
        return;
      }

      const response = await fetch(`${backendURL}/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity: 1 }),
      });

      if (response.ok) {
        fetchCartCount();
        fetchCartItems();
      } else {
        console.error("Failed to add product to cart.");
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  };

  // Reduce quantity of product in cart
  const handleReduceQuantity = async (productId) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("Please log in to modify your cart.");
        return;
      }

      const response = await fetch(`${backendURL}/cart/reduce`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity: 1 }),
      });

      if (response.ok) {
        fetchCartCount();
        fetchCartItems();
      } else {
        console.error("Failed to reduce product quantity in cart.");
      }
    } catch (error) {
      console.error("Error reducing product quantity in cart:", error);
    }
  };

  return (
    <div className="home-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">FoodCarT</div>

        <div className="nav-center">
          {isLoggedIn && (
            <>
              <input
                type="text"
                className="search-bar"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="search-button" onClick={fetchProducts}>
                Search
              </button>
            </>
          )}
        </div>

        <div className="nav-links">
          {isLoggedIn ? (
            <>
              {isAdmin && (
                <button
                  className="nav-button"
                  onClick={() => navigate("/add-product")}
                >
                  Add Product
                </button>
              )}
              <button className="nav-button" onClick={handleLogout}>
                Logout
              </button>
              <div className="cart-icon" onClick={() => navigate("/cart")}>
                <img src="/images/cart.jpg" alt="Cart" className="cart-image" />
                <span>{cartCount}</span>
              </div>
            </>
          ) : (
            <>
              <a href="/login" className="nav-button">
                Login
              </a>
              <a href="/register" className="nav-button">
                Signup
              </a>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="hero">
        <div className="hero-content">
          <h1>Welcome to FoodCarT</h1>
          <p>Your one-stop shop for quick groceries!</p>
        </div>
      </div>

      {/* Search Results */}
      {products.length > 0 && (
        <div className="product-list">
          {products.map((product) => (
            <div
              key={product._id}
              className="product-item"
              onClick={() => navigate(`/product/${product._id}`)}
              style={{ cursor: "pointer" }}
            >
              <div className="product-image-container">
                <img
                  src={product.imageUrl || "https://via.placeholder.com/150"}
                  alt={product.name}
                  className="product-image"
                />
              </div>
              <div className="product-details">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">₹{product.price}</p>
              </div>
              <div className="cart-controls">
                {cartItems[product._id] > 0 && (
                  <button
                    className="cart-button reduce"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReduceQuantity(product._id);
                    }}
                  >
                    -
                  </button>
                )}
                <span className="cart-quantity">
                  {cartItems[product._id] || 0}
                </span>
                <button
                  className="cart-button add"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(product._id);
                  }}
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <footer>© 2024 Clone</footer>
    </div>
  );
}

export default Home;
