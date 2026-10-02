import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import "./Wishlist.css";

function Wishlist() {
  const {
    wishlist,
    loading,
    removeProductFromWishlist,
  } = useWishlist();

  if (loading) {
    return (
      <div className="wishlist-page">
        <div className="empty-wishlist">
          <div className="empty-wishlist-icon">⏳</div>

          <h1>Loading Wishlist...</h1>

          <p>Please wait while we load your saved products.</p>
        </div>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="wishlist-page">
        <div className="empty-wishlist">
          <div className="empty-wishlist-icon">❤️</div>

          <h1>My Wishlist</h1>

          <p>
            Your wishlist is empty. Save products you love
            and find them here later.
          </p>

          <Link
            to="/products"
            className="wishlist-shopping-button"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="wishlist-container">

        <div className="wishlist-header">
          <h1>My Wishlist</h1>
          <p>
            {wishlist.length} item
            {wishlist.length !== 1 ? "s" : ""} saved
          </p>
        </div>

        <div className="wishlist-grid">
          {wishlist.map((item) => (
            <div className="wishlist-card" key={item.id}>

              <div className="wishlist-image-container">
                {item.product_image ? (
                  <img
                    src={item.product_image}
                    alt={item.product_name}
                    className="wishlist-image"
                  />
                ) : (
                  <div className="wishlist-image-placeholder">
                    🛍️
                  </div>
                )}

                <div className="wishlist-heart">
                  ❤️
                </div>
              </div>

              <div className="wishlist-info">
                <h2>{item.product_name}</h2>

                <p className="wishlist-price">
                  ₹{Number(item.product_price).toFixed(2)}
                </p>

                <div className="wishlist-actions">
                  <Link
                    to={`/products/${item.product}`}
                    className="wishlist-view-button"
                  >
                    View Product
                  </Link>

                  <button
                    className="wishlist-remove-button"
                    onClick={() => {
                      const confirmed = window.confirm(
                        `Remove "${item.product_name}" from your wishlist?`
                      );

                      if (confirmed) {
                        removeProductFromWishlist(item.id);
                      }
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default Wishlist;