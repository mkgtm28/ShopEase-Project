import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../api/wishlistApi";

import { useAuth } from "./AuthContext";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const { isLoggedIn } = useAuth();

  const loadWishlist = async () => {
    if (!isLoggedIn) {
      setWishlist([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const data = await getWishlist();
      setWishlist(data.results || []);
    } catch (error) {
      console.error(
        "Unable to load wishlist:",
        error
      );

      setWishlist([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, [isLoggedIn]);

  const addProductToWishlist = async (productId) => {
    try {
      const item = await addToWishlist(productId);

      setWishlist((currentWishlist) => [
        item,
        ...currentWishlist,
      ]);
    } catch (error) {
      console.error(
        "Unable to add to wishlist:",
        error
      );
    }
  };

  const removeProductFromWishlist = async (wishlistId) => {
    try {
      await removeFromWishlist(wishlistId);

      setWishlist((currentWishlist) =>
        currentWishlist.filter(
          (item) => item.id !== wishlistId
        )
      );
    } catch (error) {
      console.error(
        "Unable to remove from wishlist:",
        error
      );
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some(
      (item) => item.product === productId
    );
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        addProductToWishlist,
        removeProductFromWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}