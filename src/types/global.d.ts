declare global {
  interface Window {
    Tawk_API?: {
      maximize: () => void;
    };
  }
}

export {};
