/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import { serverFetch } from "@/lib/server-fetch"
import z from "zod"



const createCategoryZodSchema = z.object({
    name: z.string().min(3, "Category name must be at least 3 characters long"),
    slag: z.string().min(3, "Category slag must be at least 3 characters long")
})

export async function createCategory(_prevState: any, formData: FormData) {
    try {
        const payload = {
            name: formData.get("name"),
            slag: formData.get("slag")
        }

        const validatePayload = createCategoryZodSchema.safeParse(payload)

        if (!validatePayload.success) {
            return {
                success: false,
                errors: validatePayload.error.issues.map((issue) => {
                    return {
                        field: issue.path[0],
                        message: issue.message
                    }
                })
            }
        }

        const newFormData = new FormData();
        newFormData.append("name", JSON.stringify(validatePayload))

        const res = await serverFetch.post("/category", {
            body: newFormData
        })

        const result = await res.json();
        return result;

    } catch (error: any) {
        return {
            success: false,
            message: `${process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'}`
        }
    }
}


export async function getAllCategories() {
    try {

        const res = await serverFetch.get("/category");
        const result = await res.json();
        return result;

    } catch (error: any) {
        return {
            success: false,
            message: `${process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'}`
        }
    }
}

export async function deleteCategory(id: string) {
    try {

        const res = await serverFetch.delete(`/category/${id}`);
        const result = await res.json();
        return result;

    } catch (error: any) {
        return {
            success: false,
            message: `${process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'}`
        }
    }
}