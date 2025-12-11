/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { z } from "zod";
import { serverFetch } from "@/lib/server-fetch";
import { ProductValidation } from "@/zod/product.validation";
import { zodValidator } from "@/lib/zodValidator";


// Zod Validation Schema

const productSchema = z.object({
  title: z.string().min(1, "Product title is required"),
  slug: z.string().min(1, "Slug is required"),
  price: z.string().min(1, "Price is required"),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  color: z.string().optional(),
  newArrival: z.string(),
  intro: z.string().optional(),
  bulletPoints: z.string().optional(),
  outro: z.string().optional(),
  variants: z.string().optional(),
  categoryIds: z.string().optional(),
});


// DELETE PRODUCT

export const deleteProduct = async (_prevState: any, id: string) => {
  try {
    const response = await serverFetch.delete(`/product/${id}`);
    const result = await response.json();

    if (!response.ok) {
      return { success: false, message: result.message || "Failed to delete product" };
    }

    return { success: true, message: result.message };
  } catch (error: any) {
    return { success: false, message: error.message || "Something went wrong" };
  }
};


// GET ALL PRODUCTS

export const getProducts = async (queryString?: string) => {
  try {
    const response = await serverFetch.get(`/product${queryString ? `?${queryString}` : ""}`);
    const result = await response.json();
    return result || [];
  } catch {
    return [];
  }
};


// GET SINGLE PRODUCT

export const getProductById = async (id: string) => {
  try {
    const response = await serverFetch.get(`/product/${id}`);
    const result = await response.json();
    return result.data || null;
  } catch {
    return null;
  }
};
