import { createContext, useContext, useEffect, useState } from "react";
import { addToCartApi, getAllCartItemsApi } from "../api/cartApi";

const CartContext = createContext(undefined);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const fetchAllCartItems = async () => {
    try {
      const res = await getAllCartItemsApi();
      setCart(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllCartItems();
  }, []);

  const addToCart = async (course) => {
    setCart((prevCart) => {
      const existingCourse = prevCart.find((item) => item.name === course.name);

      if (existingCourse) {
        return prevCart.map((item) =>
          item.name === course.name
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item,
        );
      }

      return [...prevCart, { ...course, quantity: 1 }];
    });
  };

  const removeFromCart = (course) => {
    setCart((prevCart) => prevCart.filter((item) => item.name !== course.name));
  };

  const cartCount = cart.reduce(
    (total, item) => total + (item.quantity || 1),
    0,
  );

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, cartCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
