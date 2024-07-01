/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react';

const useTurnStileHook = (): [boolean] => {
  const intervalRef = useRef(null);

  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const turnstileDiv = document.getElementById('cf-turnstile');
      const isLoaded =
        turnstileDiv?.innerHTML.includes('<input') &&
        turnstileDiv?.innerHTML.includes('value=');

      if (isLoaded) {
        setIsLoaded(true);
        clearInterval(intervalRef.current as any);
      }
    }, 1000) as any;

    return () => {
      clearInterval(intervalRef.current as any);
    };
  }, []);

  return [isLoaded];
};

export default useTurnStileHook;
