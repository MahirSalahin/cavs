import axios, { AxiosError, AxiosRequestConfig } from "axios";


export const axiosAuth = axios.create({
    baseURL: process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export type AxiosResponseType = {
    success: boolean;
    message: string;
    data: object | null | undefined;
    errors: [string] | null;
};

// Define a type for options that can include headers and other AxiosRequestConfig properties
export interface Axios2Options extends AxiosRequestConfig {
    headers?: object;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'; // Define possible HTTP methods
}

// Create a generic axios function that can handle different HTTP methods
export const axios2 = async (url: string, options: Axios2Options = {}): Promise<AxiosResponseType> => {
    try {
        const res = await axiosAuth( url, {
            method: options.method || 'GET', // Default to GET if no method is provided
            headers: {
                ...axiosAuth.defaults.headers,
                ...options.headers,
            },
            ...options,
        });

        return res.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response) {
            return error.response.data; // Return the server response data if available
        }

        // Return a generic error message if there's no specific server response
        return {
            success: false,
            message: "Failed to fetch data",
            data: null,
            errors: null
        };
    }
};