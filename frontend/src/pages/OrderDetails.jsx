import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getOrder } from "../api/orderApi";
import "./OrderDetails.css";

function OrderDetails() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrder(id);
        setOrder(data);
      } catch (error) {
        console.error(error);
        setError("Unable to load order.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="order-details-message">
        <div className="order-details-icon">📦</div>
        <h2>Loading order...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-details-message">
        <div className="order-details-icon">⚠️</div>
        <h2>{error}</h2>
        <Link to="/orders" className="back-orders-button">
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="order-details-page">
      <div className="order-details-container">

        {/* Header */}
        <div className="order-details-header">
          <div>
            <p className="order-details-label">Order Details</p>

            <h1>Order #{order.id}</h1>

            <p className="order-date">
              Placed on{" "}
              {new Date(order.created_at).toLocaleString()}
            </p>
          </div>

          <span
            className={`order-details-status status-${order.status.toLowerCase()}`}
          >
            {order.status}
          </span>
        </div>

        <div className="order-details-layout">

          {/* Main Content */}
          <div className="order-details-main">

            {/* Shipping */}
            <section className="details-card">
              <h2>Shipping Information</h2>

              <div className="shipping-details">
                <div>
                  <span>Full Name</span>
                  <strong>{order.full_name}</strong>
                </div>

                <div>
                  <span>Phone</span>
                  <strong>{order.phone}</strong>
                </div>

                <div className="full-width">
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
            </section>

            {/* Products */}
            <section className="details-card">
              <h2>Ordered Products</h2>

              <div className="ordered-products">
                {order.items.map((item) => (
                  <div
                    className="ordered-product"
                    key={item.product}
                  >
                    <div className="ordered-product-image">
                      {item.product_image ? (
                        <img
                          src={item.product_image}
                          alt={item.product_name}
                        />
                      ) : (
                        <span>🛍️</span>
                      )}
                    </div>

                    <div className="ordered-product-info">
                      <h3>{item.product_name}</h3>

                      <p>
                        Price: ₹
                        {Number(item.price).toFixed(2)}
                      </p>

                      <p>
                        Quantity: {item.quantity}
                      </p>
                    </div>

                    <div className="ordered-product-total">
                      ₹
                      {(
                        Number(item.price) *
                        item.quantity
                      ).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* Summary */}
          <aside className="order-summary-card">
            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>Products</span>
              <span>{order.items.length}</span>
            </div>

            <div className="summary-row">
              <span>Status</span>
              <span>{order.status}</span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-total">
              <span>Total</span>

              <strong>
                ₹{Number(order.total_amount).toFixed(2)}
              </strong>
            </div>

            <Link
              to="/orders"
              className="back-orders-button"
            >
              ← Back to Orders
            </Link>
          </aside>

        </div>
      </div>
    </div>
  );
}

export default OrderDetails;