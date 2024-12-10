import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Product from './pages/Product';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import OrderDetails from './pages/OrderDetails';  // Order details page
import PaymentPage from './pages/PaymentPage';  // Adjust the import based on your structure
import AddProduct from "./pages/AddProduct"; // Import the component
import UpdateProduct from "./pages/UpdateProduct"; // Import the component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/product" element={<Product />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/order/:orderId" element={<OrderDetails />} />  {/* Order details route */}
        <Route path="/payment/:id" element={<PaymentPage />} />  {/* Define this route */}
        <Route path="/add-product" element={<AddProduct />} /> {/* New Route */}
        <Route path="/update-product/:id" element={<UpdateProduct />} />
      </Routes>
    </Router>
  );
}

export default App;
