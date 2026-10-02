import { NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const { cart } = useCart();
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinkClass = ({ isActive }) =>
    isActive ? "navbar-link active" : "navbar-link";

  return (
    <nav className="navbar">
      <div className="navbar-container">

        <NavLink to="/" className="navbar-logo">
          ShopEase
        </NavLink>

        <div className="navbar-links">

          <NavLink
            to="/"
            className={navLinkClass}
            end
          >
            Home
          </NavLink>

          <NavLink
            to="/products"
            className={navLinkClass}
          >
            Products
          </NavLink>

          <NavLink
            to="/wishlist"
            className={navLinkClass}
          >
            ❤️ Wishlist
          </NavLink>

          <NavLink
            to="/cart"
            className={({ isActive }) =>
              isActive
                ? "navbar-link cart-link active"
                : "navbar-link cart-link"
            }
          >
            🛒 Cart
            <span className="cart-count">
              {cartCount}
            </span>
          </NavLink>

          {isLoggedIn && (
            <>
              <NavLink
                to="/orders"
                className={navLinkClass}
              >
                Orders
              </NavLink>

              <NavLink
                to="/profile"
                className={navLinkClass}
              >
                Profile
              </NavLink>

              <button
                className="logout-button"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          )}

          {!isLoggedIn && (
            <>
              <NavLink
                to="/login"
                className={navLinkClass}
              >
                Login
              </NavLink>

              <NavLink
                to="/register"
                className={navLinkClass}
              >
                Register
              </NavLink>
            </>
          )}

        </div>
      </div>
    </nav>
  );
}

export default Navbar;