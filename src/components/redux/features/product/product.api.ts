import { baseApi } from "../../baseApi";



export const ProductApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Create Product
        createProduct: builder.mutation({
            query: (formData) => ({
                url: "/product/create-product",
                method: "POST",
                body: formData, // multipart form data
            }),
            invalidatesTags: ["Products"]
        }),

        // Get All Products
        getAllProducts: builder.query({
            query: () => ({
                url: "/product",
                method: "GET"                
            }),
            providesTags: ["Products"]
        }),

        //  Get Single Product
        getProductById: builder.query({
            query: (id) => ({
                url: `/product/${id}`,
                method: "GET",
            }),
            providesTags: ["Products"]
        }),

        //  Update Product
        updateProduct: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/product/${id}`,
                method: "PATCH",
                body: formData, // multipart form-data
            }),
            invalidatesTags: ["Products"]
        }),

        //  Delete Product
        deleteProduct: builder.mutation({
            query: (id) => ({
                url: `/product/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Products"]
        }),
    }),
});

export const {
    useCreateProductMutation,
    useGetAllProductsQuery,
    useGetProductByIdQuery,
    useUpdateProductMutation,
    useDeleteProductMutation,
} = ProductApi