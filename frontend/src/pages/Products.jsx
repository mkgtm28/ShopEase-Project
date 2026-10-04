import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../api/productApi";
import "./Products.css";

function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [ordering, setOrdering] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await getProducts(
          search,
          category,
          ordering,
          page
        );

        setProducts(data.results);
        setTotalPages(Math.ceil(data.count / 6));
      } catch (error) {
        console.error(error);
        setError("Unable to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [search, category, ordering, page]);

  useEffect(() => {
    setPage(1);
  }, [search, category, ordering]);

  return (
    <div className="products-page">
      <div className="products-container">

        {/* Header */}
        <div className="products-header">
          <h1>Products</h1>
          <p>
            Discover our collection of quality products.
          </p>
        </div>

        {/* Filters */}
        <div className="product-filters">

          <input
            type="text"
            className="product-search"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="product-filter"
            value={category}
            
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
            <option value="Books">Books</option>
            <option value="Accessories">Accessories</option>
            <option value="Gaming">Gaming</option>
            <option value="Home Designing">Home Designing</option>
          </select>

          <select
            className="product-filter"
            value={ordering}
            onChange={(e) => setOrdering(e.target.value)}
          >
            <option value="">Sort by</option>
            <option value="price">
              Price: Low to High
            </option>
            <option value="-price">
              Price: High to Low
            </option>
            <option value="name">
              Name: A to Z
            </option>
            <option value="-name">
              Name: Z to A
            </option>
            <option value="-created_at">
              Newest
            </option>
          </select>

        </div>

        {/* Loading */}
        {loading && (
          <div className="products-message">
            <p>Loading products...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="products-message">
            <p>{error}</p>
          </div>
        )}

        {/* No Products */}
        {!loading &&
          !error &&
          products.length === 0 && (
            <div className="products-message">
              <p>No products found.</p>
            </div>
          )}

        {/* Products */}
        {!loading &&
          !error &&
          products.length > 0 && (
            <>
              <div className="products-grid">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))}
              </div>

              {/* Pagination */}
              <div className="products-pagination">

                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                >
                  Previous
                </button>

                <span>
                  Page {page} of {totalPages}
                </span>

                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                >
                  Next
                </button>

              </div>
            </>
          )}

      </div>
    </div>
  );
}

export default Products;