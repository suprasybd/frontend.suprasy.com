/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react';

const useTurnStileHook = (): [boolean] => {
  const intervalRef = useRef(null);

  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    script.defer = true;

    document.body.appendChild(script);

    intervalRef.current = setInterval(() => {
      const turnstileDiv = document.getElementById('suprasy-turnstile');
      const isLoaded =
        turnstileDiv?.innerHTML.includes('<input') &&
        turnstileDiv?.innerHTML.includes('value=');

      if (isLoaded) {
        setIsLoaded(true);
        clearInterval(intervalRef.current as any);
      }
    }, 1000) as any;

    return () => {
      document.body.removeChild(script);
      clearInterval(intervalRef.current as any);
    };
  }, []);

  return [isLoaded];
};

export default useTurnStileHook;
