/* eslint-disable @typescript-eslint/no-explicit-any */
import Cookies from "js-cookie";

const CART_KEY = "cart";

/* GET CART */
export const getCartFromCookie = () => {
  const cart = Cookies.get(CART_KEY);
  return cart ? JSON.parse(cart) : [];
};

/* SET CART */
export const setCartToCookie = (cart: any[]) => {
  Cookies.set(CART_KEY, JSON.stringify(cart), {
    expires: 7,
    sameSite: "lax",
  });
};

/* ADD TO CART (CORE LOGIC) */
export const addToCartCookie = (item: any) => {
  const cart = getCartFromCookie();

  // 🔑 SAME PRODUCT + SAME SIZE CHECK
  const existingItem = cart.find(
    (c: any) =>
      c.productId === item.productId &&
      c.size === item.size
  );

  if (existingItem) {
    // ✅ quantity increase
    existingItem.quantity += item.quantity;
  } else {
    // ✅ same product but different size → new entry
    cart.push(item);
  }

  setCartToCookie(cart);
};
