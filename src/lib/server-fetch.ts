import { getCookie } from "@/services/auth/tokenHandlers";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL;

export const serverFetchHelper = async(endpoint: string, options: RequestInit) : Promise<Response> =>{

    const {headers, ...restOptions} = options;
    
    const accessToken = await getCookie("accessToken");

    const response = fetch(`${BACKEND_API_URL}${endpoint}`,{
        headers: {
            ...headers,
            // ...(accessToken ? {"Authorization" : `accessToken`}: {})
            Cookie: accessToken ? `accessToken=${accessToken}` : "",
        },
        ...restOptions
    })

    return response;
}

export const serverFetch = {
    get: async (endpoint: string, options: RequestInit = {}): Promise<Response> => serverFetchHelper(endpoint, { ...options, method: "GET" }),

    post: async (endpoint: string, options: RequestInit = {}): Promise<Response> => serverFetchHelper(endpoint, { ...options, method: "POST" }),

    put: async (endpoint: string, options: RequestInit = {}): Promise<Response> => serverFetchHelper(endpoint, { ...options, method: "PUT" }),

    patch: async (endpoint: string, options: RequestInit = {}): Promise<Response> => serverFetchHelper(endpoint, { ...options, method: "PATCH" }),

    delete: async (endpoint: string, options: RequestInit = {}): Promise<Response> => serverFetchHelper(endpoint, { ...options, method: "DELETE" }),
}