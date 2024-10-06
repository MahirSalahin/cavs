export default function ApiResponse(
    status: number,
    message?: string,
    data?: object | null | undefined,
):ApiResponseType {
    return {
        status: status || 200,
        message: message || 'Success',
        data: data,
        success: status < 400,
    }
}

export interface ApiResponseType {
    status: number
    message: string
    data: object | null | undefined
    success: boolean
}