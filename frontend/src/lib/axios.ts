import baseAxios, { AxiosError, AxiosRequestConfig } from "axios";


export const axiosAuth = baseAxios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Update AxiosResponseType to use the new DataType type
export type AxiosResponseType<T> = {
    success: boolean;
    message: string;
    data: T;
    errors: [string] | null;
};
// Define a type for options that can include headers and other AxiosRequestConfig properties
export interface Axios2Options extends AxiosRequestConfig {
    headers?: object;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'; // Define possible HTTP methods
}

// Create a generic axios function that can handle different HTTP methods
export const axios = async <T>(url: string, options: Axios2Options = {}): Promise<AxiosResponseType<T>> => {
    try {
        const res = await axiosAuth(url, {
            method: options.method || 'GET', // Default to GET if no method is provided
            headers: {
                ...axiosAuth.defaults.headers,
                ...options.headers,
            },
            ...options,
        });

        if (res.status >= 400) throw res;

        return {
            success: true,
            message: "Successful",
            data: res.data as T,
            errors: null,
        };
    } catch (error) {
        if (error instanceof AxiosError && error.response) {
            return {
                success: false,
                message: error.response.data.detail,
                data: null as unknown as T,
                errors: null,
            };
        }

        // Return a generic error message if there's no specific server response
        return {
            success: false,
            message: "Failed to fetch data",
            data: null as unknown as T,
            errors: null,
        };
    }
};
