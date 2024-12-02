declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (
      command: string,
      eventName: string,
      eventData?: Record<string, unknown>,
    ) => void;
  }
}

export {};
