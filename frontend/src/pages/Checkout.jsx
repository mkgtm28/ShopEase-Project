
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { createOrder } from "../api/orderApi";
import "./Checkout.css";

function Checkout() {
  const { cart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    const fullName = formData.full_name.trim();
    const phone = formData.phone.trim();
    const address = formData.address.trim();
    const city = formData.city.trim();
    const state = formData.state.trim();
    const pincode = formData.pincode.trim();

    if (
      !fullName ||
      !phone ||
      !address ||
      !city ||
      !state ||
      !pincode
    ) {
      setError("Please fill in all shipping details.");
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    if (!/^\d{6}$/.test(pincode)) {
      setError("Please enter a valid 6-digit pincode.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const orderData = {
        full_name: fullName,
        phone,
        address,
        city,
        state,
        pincode,
        items: cart.map((item) => ({
          product: item.id,
          quantity: item.quantity,
        })),
      };

      await createOrder(orderData);

      clearCart();

      navigate("/orders");
    } catch (error) {
      console.error("Unable to place order:", error);

      if (error.response?.data?.non_field_errors) {
        setError(
          error.response.data.non_field_errors[0]
        );
      } else if (error.response?.data?.detail) {
        setError(error.response.data.detail);
      } else if (error.response?.data?.items) {
        setError(
          Array.isArray(error.response.data.items)
            ? error.response.data.items[0]
            : "There is a problem with your cart items."
        );
      } else if (error.response?.data) {
        setError(
          "Please check your shipping information and try again."
        );
      } else {
        setError(
          "Unable to place order. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="checkout-page">
        <div className="empty-checkout">
          <div className="empty-checkout-icon">🛒</div>

          <h1>Your Cart is Empty</h1>

          <p>
            Add some products before proceeding to checkout.
          </p>

          <Link
            to="/products"
            className="checkout-shopping-button"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">

        <div className="checkout-header">
          <h1>Checkout</h1>
          <p>Complete your shipping information to place your order.</p>
        </div>

        <div className="checkout-layout">

          {/* Shipping Information */}
          <div className="shipping-card">
            <h2>Shipping Information</h2>

            {error && (
              <div className="checkout-error">
                {error}
              </div>
            )}

            <form onSubmit={handlePlaceOrder}>

              <div className="checkout-field">
                <label htmlFor="full_name">
                  Full Name
                </label>

                <input
                  id="full_name"
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="checkout-field">
                <label htmlFor="phone">
                  Phone Number
                </label>

                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              <div className="checkout-field">
                <label htmlFor="address">
                  Address
                </label>

                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your complete address"
                  rows="4"
                  required
                />
              </div>

              <div className="checkout-row">

                <div className="checkout-field">
                  <label htmlFor="city">
                    City
                  </label>

                  <input
                    id="city"
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                    required
                  />
                </div>

                <div className="checkout-field">
                  <label htmlFor="state">
                    State
                  </label>

                  <input
                    id="state"
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="State"
                    required
                  />
                </div>

              </div>

              <div className="checkout-field">
                <label htmlFor="pincode">
                  Pincode
                </label>

                <input
                  id="pincode"
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="Enter 6-digit pincode"
                  required
                />
              </div>

              <button
                type="submit"
                className="place-order-button"
                disabled={loading}
              >
                {loading
                  ? "Placing Order..."
                  : "Place Order"}
              </button>

              <Link
                to="/cart"
                className="back-cart-button"
              >
                ← Back to Cart
              </Link>

            </form>
          </div>

          {/* Order Summary */}
          <div className="checkout-summary">

            <h2>Order Summary</h2>

            <div className="checkout-items">

              {cart.map((item) => (
                <div
                  className="checkout-item"
                  key={item.id}
                >
                  <div className="checkout-item-image">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                      />
                    ) : (
                      <span>🛍️</span>
                    )}
                  </div>

                  <div className="checkout-item-info">
                    <h3>{item.name}</h3>

                    <p>
                      ₹{Number(item.price).toFixed(2)}
                    </p>

                    <span>
                      Quantity: {item.quantity}
                    </span>
                  </div>

                  <strong>
                    ₹
                    {(
                      Number(item.price) *
                      item.quantity
                    ).toFixed(2)}
                  </strong>
                </div>
              ))}

            </div>

            <div className="checkout-total">
              <span>Total</span>

              <strong>
                ₹{getCartTotal().toFixed(2)}
              </strong>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default Checkout;

