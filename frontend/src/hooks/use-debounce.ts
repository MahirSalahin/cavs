import { useRef, useEffect, useCallback } from 'react';

function useDebounce<Args extends unknown[]>(
  func: (...args: Args) => void,
  wait: number = 1000
) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debouncedFunc = useCallback(
    (...args: Args) => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        func(...args);
      }, wait);
    },
    [func, wait]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [wait]);

  return debouncedFunc;
}

export default useDebounce;