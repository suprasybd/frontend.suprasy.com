/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useRef, useState } from 'react';

const useTurnStileHook = (): [boolean, () => void] => {
  const intervalRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const checkTurnstile = useCallback(() => {
    const turnstileDiv = document.getElementById('cf-turnstile');
    const isLoaded =
      turnstileDiv?.innerHTML.includes('<input') &&
      turnstileDiv?.innerHTML.includes('value=');

    if (isLoaded) {
      setIsLoaded(true);
      clearInterval(intervalRef.current as any);
      intervalRef.current = null;
    }
  }, []);

  const resetTurnstile = useCallback(() => {
    setIsLoaded(false);
    if (window.turnstile) {
      window.turnstile.reset();
    }
    if (!intervalRef.current) {
      intervalRef.current = setInterval(checkTurnstile, 1000);
    }
  }, [checkTurnstile]);

  useEffect(() => {
    intervalRef.current = setInterval(checkTurnstile, 1000) as any;

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current as any);
      }
    };
  }, [checkTurnstile]);

  return [isLoaded, resetTurnstile];
};

export default useTurnStileHook;
