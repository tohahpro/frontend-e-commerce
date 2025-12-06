/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { z } from "zod";
import { serverFetch } from "@/lib/server-fetch";
import { de } from "zod/v4/locales";
import { FileMetadata } from "@/hooks/use-file-upload";
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


// CREATE PRODUCT


// export const createProduct = async (
//   currentState: any,
//   formData: FormData
// ): Promise<any> => {
//   try {
//     const title = formData.get("title") as string;
//     const slug = formData.get("slug") as string;
//     const price = Number(formData.get("price"));
//     const sku = formData.get("sku") as string;
//     const barcode = formData.get("barcode") as string;
//     const color = formData.get("color") as string;
//     const arrival = formData.get("arrival")
//     console.log(arrival);
//     const intro = formData.get("intro") as string;
//     const outro = formData.get("outro") as string;

//     const bulletPoints = JSON.parse(formData.get("bulletPoints") as string);
//     const variants = JSON.parse(formData.get("variants") as string);
//     const categories = JSON.parse(formData.get("categories") as string);

//     const images: File[] = formData.getAll("images") as File[];

//     const productData = {
//       title,
//       slug,
//       price,
//       sku,
//       barcode,
//       color,
//       arrival,
//       description: {
//         intro,
//         bulletPoints,
//         outro,
//       },
//       variantOptions: variants,
//       categories,
//     };

//     const multipart = new FormData();


//     multipart.append("data", JSON.stringify(productData));

//     images.forEach((img) => multipart.append("files", img as File));
//  console.log(multipart);
//     const res = await serverFetch.post("/product/create-product", {
//       body: multipart,
//     });

//     const json = await res.json();
//     return json;


//   } catch (error) {
//     console.error("❌ createProduct error:", error);
//     return { success: false, error };
//   }
// };

export const createProduct = async (
  currentState: any,
  formData: FormData
): Promise<any> => {
  const validationPayload = {
    title: formData.get("title") as string,
    slug: formData.get("slug") as string,
    price: Number(formData.get("price")),
    sku: formData.get("sku") as string,
    barcode: formData.get("barcode") as string,
    color: formData.get("color") as string,
    arrival: formData.get("arrival"),

    intro: formData.get("intro") as string,
    outro: formData.get("outro") as string,

    bulletPoints: JSON.parse(formData.get("bulletPoints") as string),
    variants: JSON.parse(formData.get("variants") as string),
    categories: JSON.parse(formData.get("categories") as string),

    images: formData.getAll("images") as File[],
  };

  const validatedPayload = zodValidator(
    validationPayload,
    ProductValidation.createProductSchema
  );

  if (!validatedPayload.success) {
    return {
      success: false,
      message: "Validation failed",
      formData: validationPayload,
      errors: validatedPayload.errors,
    };
  }

  if (!validatedPayload.data) {
    return {
      success: false,
      message: "Validation failed",
      formData: validationPayload,
    };
  }

  // ✔ FIX: Properly typed data
  type CreateProductInput = z.infer<typeof ProductValidation.createProductSchema>;
  const data = validatedPayload.data as CreateProductInput;


  const productData = {
    title: validatedPayload.data.title,
    slug: validatedPayload.data.slug,
    price: validatedPayload.data.price,
    sku: validatedPayload.data.sku,
    barcode: validatedPayload.data.barcode,
    color: validatedPayload.data.color,
    arrival: validatedPayload.data.arrival,
    description: {
      intro: validatedPayload.data.intro,
      bulletPoints: validatedPayload.data.bulletPoints,
      outro: validatedPayload.data.outro,
    },
    variantOptions: validatedPayload.data.variants,
    categories: validatedPayload.data.categories,
  };

  const multipart = new FormData();
  multipart.append("data", JSON.stringify(productData));

  // ✔ Type-safe images
  data.images.forEach((img: any) => multipart.append("files", img));

  try {
    const res = await serverFetch.post("/product/create-product", {
      body: multipart,
    });

    return await res.json();
  } catch (error) {
    console.error("❌ createProduct error:", error);
    return { success: false, error };
  }
};


// UPDATE PRODUCT

export const updateProduct = async (
  _prevState: any,
  productId: string,
  formData: FormData
) => {
  try {
    const rawData = Object.fromEntries(formData.entries());
    const validated = productSchema.safeParse(rawData);

    if (!validated.success) {
      return {
        success: false,
        message: "Validation failed",
        errors: validated.error.flatten().fieldErrors,
      };
    }

    const newFormData = new FormData();

    newFormData.append("title", validated.data.title);
    newFormData.append("slug", validated.data.slug);
    newFormData.append("price", validated.data.price);
    if (validated.data.sku) newFormData.append("sku", validated.data.sku);
    if (validated.data.barcode) newFormData.append("barcode", validated.data.barcode);
    if (validated.data.color) newFormData.append("color", validated.data.color);
    newFormData.append("newArrival", validated.data.newArrival);

    newFormData.append(
      "description",
      JSON.stringify({
        intro: validated.data.intro || "",
        bulletPoints: validated.data.bulletPoints
          ? validated.data.bulletPoints.split(",").map((b) => b.trim())
          : [],
        outro: validated.data.outro || "",
      })
    );

    if (validated.data.variants) newFormData.append("variants", validated.data.variants);
    if (validated.data.categoryIds) newFormData.append("categories", validated.data.categoryIds);

    const files = formData.getAll("files");
    files.forEach((file) => {
      if (file instanceof File) newFormData.append("files", file);
    });

    const response = await serverFetch.patch(`/product/${productId}`, {
      body: newFormData,
    });

    const result = await response.json();

    if (!response.ok) {
      return { success: false, message: result.message || "Failed to update product" };
    }

    return {
      success: true,
      message: result.message,
      data: result.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Something went wrong",
    };
  }
};


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
    return result.data || [];
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
