import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProduct } from "../api/productApi";
import { useCart } from "../context/CartContext";
import "./ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProduct(id);
        setProduct(data);
      } catch (error) {
        console.error(error);
        setError("Product not found");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="product-details-message">
        Loading product...
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-details-message">
        {error}
      </div>
    );
  }

  return (
    <div className="product-details-page">
      <div className="product-details-container">

        {/* Product Image */}
        <div>
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="product-details-image"
            />
          ) : (
            <div className="product-details-image-placeholder">
              🛍️
            </div>
          )}
        </div>

        {/* Product Information */}
        <div className="product-details-info">

          <p className="product-details-category">
            {product.category}
          </p>

          <h1>{product.name}</h1>

          <p className="product-details-description">
            {product.description}
          </p>

          <h2 className="product-details-price">
            ₹{Number(product.price).toFixed(2)}
          </h2>

          <p
            className={
              product.stock > 0
                ? "product-details-stock"
                : "product-details-stock out"
            }
          >
            {product.stock > 0
              ? `${product.stock} available`
              : "Out of stock"}
          </p>

          {product.stock > 0 ? (
            <button
              className="add-cart-button"
              onClick={() => addToCart(product)}
            >
              🛒 Add to Cart
            </button>
          ) : (
            <button
              className="add-cart-button"
              disabled
            >
              Out of Stock
            </button>
          )}

          <Link
            to="/products"
            className="back-products-button"
          >
            ← Back to Products
          </Link>

        </div>
      </div>
    </div>
  );
}

export default ProductDetails;