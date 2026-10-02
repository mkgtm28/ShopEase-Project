
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../api/productApi";
import "./Home.css";

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts("", "", "", 1);

        // Show only the first 3 products
        setProducts(data.results.slice(0, 3));
      } catch (error) {
        console.error("Unable to load products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="home">

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>
            Shop Smarter.
            <br />
            Shop <span>Better.</span>
          </h1>

          <p>
            Discover quality products at great prices.
            Find everything you need in one place.
          </p>

          <div className="hero-buttons">
            <Link to="/products" className="hero-button">
              Shop Now
            </Link>

            <Link
              to="/products"
              className="hero-button secondary"
            >
              Explore Products
            </Link>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-icon">🛍️</div>
        </div>
      </section>

      {/* Categories */}
      <section className="categories">
        <div className="section-title">
          <h2>Shop by Category</h2>
          <p>Explore products from different categories.</p>
        </div>

        <div className="category-grid">
          <Link
            to="/products?category=Electronics"
            className="category-card"
          >
            <div className="category-icon">💻</div>
            <h3>Electronics</h3>
            <p>Latest electronic products</p>
          </Link>

          <Link
            to="/products?category=Fashion"
            className="category-card"
          >
            <div className="category-icon">👕</div>
            <h3>Fashion</h3>
            <p>Style for every occasion</p>
          </Link>

          <Link
            to="/products?category=Home"
            className="category-card"
          >
            <div className="category-icon">🏠</div>
            <h3>Home</h3>
            <p>Products for your home</p>
          </Link>

          <Link
            to="/products?category=Gaming"
            className="category-card"
          >
            <div className="category-icon">🎮</div>
            <h3>Gaming</h3>
            <p>Level up your gaming setup</p>
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-products">
        <div className="section-title">
          <h2>Featured Products</h2>
          <p>Check out some of our popular products.</p>
        </div>

        {loading ? (
          <p>Loading products...</p>
        ) : products.length === 0 ? (
          <p>No products available.</p>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <div className="featured-card" key={product.id}>

                <div className="featured-card-image">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                    />
                  ) : (
                    <span className="hero-icon">🛍️</span>
                  )}
                </div>

                <div className="featured-card-content">
                  <h3>{product.name}</h3>

                  <p className="featured-price">
                    ₹{Number(product.price).toFixed(2)}
                  </p>

                  <Link
                    to={`/products/${product.id}`}
                    className="hero-button"
                  >
                    View Product
                  </Link>
                </div>

              </div>
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="home-cta">
        <h2>Ready to Start Shopping?</h2>

        <p>
          Explore our complete collection and find
          something you love.
        </p>

        <Link to="/products" className="hero-button">
          View All Products
        </Link>
      </section>

    </div>
  );
}

export default Home;

