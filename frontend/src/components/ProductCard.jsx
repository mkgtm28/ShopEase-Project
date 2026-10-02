
import { Link, useNavigate } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import "./ProductCard.css";

function ProductCard({ product }) {
  const {
    wishlist,
    isInWishlist,
    addProductToWishlist,
    removeProductFromWishlist,
  } = useWishlist();

  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleWishlist = async () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    const wishlistItem = wishlist.find(
      (item) => item.product === product.id
    );

    if (wishlistItem) {
      await removeProductFromWishlist(wishlistItem.id);
    } else {
      await addProductToWishlist(product.id);
    }
  };

  return (
    <div className="product-card">

      {/* Product Image */}
      <div className="product-image-container">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="product-image"
          />
        ) : (
          <div className="product-image-placeholder">
            🛍️
          </div>
        )}

        {/* Wishlist */}
        <button
          className="wishlist-button"
          onClick={handleWishlist}
          aria-label={
            isInWishlist(product.id)
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
        >
          {isInWishlist(product.id) ? "❤️" : "♡"}
        </button>
      </div>

      {/* Product Information */}
      <div className="product-info">

        <p className="product-category">
          {product.category}
        </p>

        <h2>{product.name}</h2>

        <p className="product-description">
          {product.description}
        </p>

        <div className="product-bottom">

          <div>
            <h3 className="product-price">
              ₹{Number(product.price).toFixed(2)}
            </h3>

            <p
              className={
                product.stock > 0
                  ? "stock available"
                  : "stock unavailable"
              }
            >
              {product.stock > 0
                ? `${product.stock} available`
                : "Out of stock"}
            </p>
          </div>

          <Link
            to={`/products/${product.id}`}
            className="view-details-button"
          >
            View Details
          </Link>

        </div>
      </div>

    </div>
  );
}

export default ProductCard;

