/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCart } from "@/components/Provider/CartProvider";
import { Button } from "@/components/ui/button";
import { getProducts } from "@/services/admin/productManagement";
import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function CartItems() {
    const { cart, setCart, saveCart }: any = useCart();

    const [productsItems, setProductsItems] = useState<any[]>([]);

    // Single source update
    const updateCart = (updated: any[]) => {
        saveCart(updated);
        setCart([...updated]);
    };

    // Increase quantity
    const increaseQty = (variantId: string) => {
        const updated = cart.map((item: any) =>
            item.variantId === variantId
                ? { ...item, quantity: item.quantity + 1 }
                : item
        );
        updateCart(updated);
    };

    // Decrease quantity
    const decreaseQty = (variantId: string) => {
        const updated = cart.map((item: any) =>
                item.variantId === variantId
                    ? { ...item, quantity: item.quantity - 1 ? item.quantity - 1 : 1 }
                    : item
            )
            .filter((item: any) => item.quantity > 0);

        updateCart(updated);
    };

    // ❌ Remove item
    const removeItem = (variantId: string) => {
        const updated = cart.filter(
            (item: any) => item.variantId !== variantId
        );
        updateCart(updated);
    };

    // Fetch all products
    useEffect(() => {
        async function fetchData() {
            const allProducts = await getProducts();
            setProductsItems(allProducts.data);
        }
        fetchData();
    }, []);

    // Product price map (productId → price)
    const productPriceMap = productsItems.reduce((acc: any, product: any) => {
        acc[product.id] = product.price;
        return acc;
    }, {});

    // Total price
    const totalPrice = cart.reduce((sum: number, item: any) => {
        return sum + (productPriceMap[item.productId] || 0) * item.quantity;
    }, 0);

    // 🛒 Empty cart
    if (!cart || cart.length === 0) {
        return (
            <div className="text-center py-20 text-gray-500 text-lg">
                🛒 Your cart is empty
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* LEFT */}
                <div className="lg:col-span-2 space-y-4">
                    {cart.map((item: any) => (
                        <div
                            key={item.variantId}
                            className="flex gap-4 p-4 border rounded-lg bg-white shadow-sm"
                        >
                            {/* IMAGE */}
                            <Image
                                src={item.image}
                                alt={item.title}
                                width={100}
                                height={120}
                                className="rounded-md object-contain"
                            />

                            {/* INFO */}
                            <div className="flex-1">
                                <h3 className="font-semibold">{item.title}</h3>
                                <p className="text-sm text-gray-500">
                                    Size: {item.size}
                                </p>

                                <p className="font-semibold mt-1">
                                    ৳ {productPriceMap[item.productId] || 0}
                                </p>

                                {/* QUANTITY */}
                                <div className="flex items-center gap-2 mt-3">
                                    <button
                                        onClick={() =>
                                            decreaseQty(item.variantId)
                                        }
                                        className="w-8 h-8 border rounded flex items-center justify-center hover:bg-gray-100"
                                    >
                                        <Minus size={16} />
                                    </button>

                                    <span className="min-w-[30px] text-center">
                                        {item.quantity}
                                    </span>

                                    <button
                                        onClick={() =>
                                            increaseQty(item.variantId)
                                        }
                                        className="w-8 h-8 border rounded flex items-center justify-center hover:bg-gray-100"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* REMOVE */}
                            <button
                                onClick={() => removeItem(item.variantId)}
                                className="text-gray-400 hover:text-red-500"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                </div>

                {/* RIGHT */}
                <div className="border rounded-lg p-5 bg-gray-50 h-fit">
                    <h2 className="font-semibold text-lg mb-4">
                        Order Summary
                    </h2>

                    <div className="flex justify-between text-sm mb-2">
                        <span>Subtotal</span>
                        <span>৳ {totalPrice}</span>
                    </div>

                    <hr className="my-3" />

                    <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>৳ {totalPrice}</span>
                    </div>

                    <Button className="w-full mt-5">
                        Proceed to Checkout
                    </Button>
                </div>
            </div>
        </div>
    );
}
