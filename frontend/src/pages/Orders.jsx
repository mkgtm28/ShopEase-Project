import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getOrders,
  cancelOrder,
} from "../api/orderApi";
import "./Orders.css";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders();
        setOrders(data.results || data);
      } catch (error) {
        console.error(error);
        setError("Unable to load orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const statusSteps = [
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
  ];

  const getStatusIndex = (status) => {
    return statusSteps.indexOf(status);
  };

  const handleCancelOrder = async (orderId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const updatedOrder = await cancelOrder(orderId);

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === orderId ? updatedOrder : order
        )
      );
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.detail ||
        "Unable to cancel order."
      );
    }
  };

  if (loading) {
    return (
      <div className="orders-message">
        <div className="orders-loading-icon">📦</div>
        <h2>Loading orders...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-message">
        <div className="orders-error-icon">⚠️</div>
        <h2>{error}</h2>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="orders-page">
        <div className="empty-orders">
          <div className="empty-orders-icon">📦</div>

          <h1>My Orders</h1>

          <p>You haven't placed any orders yet.</p>

          <Link to="/products" className="start-shopping-button">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-container">

        <div className="orders-header">
          <h1>My Orders</h1>
          <p>
            View and manage all your orders in one place.
          </p>
        </div>

        <div className="orders-list">
          {orders.map((order) => {
            const currentStatusIndex =
              getStatusIndex(order.status);

            return (
              <div className="order-card" key={order.id}>

                {/* Order Header */}
                <div className="order-header">
                  <div>
                    <h2>Order #{order.id}</h2>

                    <p>
                      Placed on{" "}
                      {new Date(
                        order.created_at
                      ).toLocaleString()}
                    </p>
                  </div>

                  <span
                    className={`order-status status-${order.status.toLowerCase()}`}
                  >
                    {order.status}
                  </span>
                </div>

                {/* Order Progress */}
                <div className="order-progress-section">
                  <h3>Order Status</h3>

                  {order.status === "Cancelled" ? (
                    <div className="cancelled-order">
                      <span>✕</span>

                      <div>
                        <strong>Order Cancelled</strong>
                        <p>
                          Your order has been cancelled.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="order-progress">
                      {statusSteps.map((step, index) => (
                        <div
                          className="progress-step"
                          key={step}
                        >
                          <div
                            className={`progress-dot ${index <= currentStatusIndex
                                ? "active"
                                : ""
                              }`}
                          >
                            {index <= currentStatusIndex
                              ? "✓"
                              : ""}
                          </div>

                          <span>{step}</span>

                          {index <
                            statusSteps.length - 1 && (
                              <div
                                className={`progress-line ${index <
                                    currentStatusIndex
                                    ? "active"
                                    : ""
                                  }`}
                              />
                            )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Shipping Information */}
                <div className="order-section">
                  <h3>Shipping Information</h3>

                  <div className="shipping-grid">
                    <div>
                      <span>Name</span>
                      <strong>{order.full_name}</strong>
                    </div>

                    <div>
                      <span>Phone</span>
                      <strong>{order.phone}</strong>
                    </div>

                    <div>
                      <span>Address</span>
                      <strong>{order.address}</strong>
                    </div>

                    <div>
                      <span>City</span>
                      <strong>{order.city}</strong>
                    </div>

                    <div>
                      <span>State</span>
                      <strong>{order.state}</strong>
                    </div>

                    <div>
                      <span>Pincode</span>
                      <strong>{order.pincode}</strong>
                    </div>
                  </div>
                </div>

                {/* Products */}
                <div className="order-section">
                  <h3>Products</h3>

                  <div className="order-products">
                    {order.items.map((item, index) => (
                      <div
                        className="order-product"
                        key={index}
                      >
                        <div className="order-product-image">
                          {item.product_image ? (
                            <img
                              src={item.product_image}
                              alt={item.product_name}
                            />
                          ) : (
                            <span>🛍️</span>
                          )}
                        </div>

                        <div className="order-product-info">
                          <h4>{item.product_name}</h4>

                          <p>
                            Quantity: {item.quantity}
                          </p>

                          <span>
                            ₹
                            {Number(item.price).toFixed(2)}
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
                </div>

                {/* Footer */}
                <div className="order-footer">
                  <div className="order-total">
                    <span>Total</span>
                    <strong>
                      ₹
                      {Number(
                        order.total_amount
                      ).toFixed(2)}
                    </strong>
                  </div>

                  <div className="order-actions">
                    <Link
                      to={`/orders/${order.id}`}
                      className="view-order-button"
                    >
                      View Order Details
                    </Link>

                    {["Pending", "Processing"].includes(
                      order.status
                    ) && (
                        <button
                          className="cancel-order-button"
                          onClick={() =>
                            handleCancelOrder(order.id)
                          }
                        >
                          Cancel Order
                        </button>
                      )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}

export default Orders;