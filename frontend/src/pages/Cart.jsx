
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./Cart.css";

function Cart() {
  const {
    cart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    getCartTotal,
  } = useCart();

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>

          <h1>Your Cart is Empty</h1>
          <p>Add some products to your cart and they will appear here.</p>

          <Link to="/products" className="continue-shopping-button">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-header">
          <h1>Your Cart</h1>
          <p>{cart.length} item{cart.length !== 1 ? "s" : ""} in your cart</p>
        </div>

        <div className="cart-content">
          <div className="cart-items">
            {cart.map((item) => (
              <div className="cart-item" key={item.id}>
                <div className="cart-item-image">
                  {item.image ? (
                    <img src={item.image} alt={item.name} />
                  ) : (
                    <span>🛍️</span>
                  )}
                </div>

                <div className="cart-item-info">
                  <h2>{item.name}</h2>

                  <p className="cart-item-price">
                    ₹{Number(item.price).toFixed(2)}
                  </p>

                  <div className="quantity-section">
                    <span>Quantity:</span>

                    <div className="quantity-controls">
                      <button
                        onClick={() => decreaseQuantity(item.id)}
                        disabled={item.quantity <= 1}
                      >
                        −
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        onClick={() => increaseQuantity(item.id)}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <p className="cart-item-subtotal">
                    Subtotal: ₹
                    {(Number(item.price) * item.quantity).toFixed(2)}
                  </p>

                  <button
                    className="remove-cart-button"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>Items</span>
              <span>{cart.length}</span>
            </div>

            <div className="summary-row total-row">
              <span>Total</span>
              <span>₹{getCartTotal().toFixed(2)}</span>
            </div>

            <Link to="/checkout" className="checkout-button">
              Proceed to Checkout
            </Link>

            <Link to="/products" className="continue-shopping-link">
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;

