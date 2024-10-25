import ApiError, { ApiErrorType } from "./ApiError"

type AsyncFunction = (...args: unknown[]) => Promise<unknown>;

export default function AsyncHandler(fn: AsyncFunction = async () => Promise.resolve()): AsyncFunction {
    return async function (...args: unknown[]): Promise<unknown> {
        try {
            return await fn(...args)
        } catch (error) {
            console.error({ AsyncHandlerError: error })
            let errorResponse = error as ApiErrorType
            if (error instanceof Error) errorResponse = ApiError(500, error.message)
            return errorResponse
        }
    }
}