import { useRef, useEffect, useCallback } from 'react';

const useDebounce = (func: () => void, wait: number = 1000) => {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const debouncedFunc = useCallback(() => {
        if (timeoutRef.current !== null) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(func, wait)
    }, [wait, func])

    useEffect(() => {
        return () => {
            if (timeoutRef.current !== null) {
                clearTimeout(timeoutRef.current);
            }
        }
    }, [wait])

    return debouncedFunc
}

export default useDebounce;