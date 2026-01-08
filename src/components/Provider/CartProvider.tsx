"use client";

import { CartItem } from "@/types/cartItem";
import {
    getCartFromCookie,
    setCartToCookie,
} from "@/utils/cartCookie";
import {
    createContext,
    useContext,
    useState,
} from "react";

type CartContextType = {
    cart: CartItem[];
    setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
    saveCart: (items: CartItem[]) => void;
};

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [cart, setCart] = useState<CartItem[]>(() => getCartFromCookie());

    const saveCart = (items: CartItem[]) => {
        setCartToCookie(items);
        setCart([...items]);
    };

    return (
        <CartContext.Provider
            value={{ cart, setCart, saveCart }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    return context;
};
