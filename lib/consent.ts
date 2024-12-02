export const getConsentStatus = () => {
  if (typeof window === 'undefined') return false;

  const consent = localStorage.getItem('cookieConsent');
  const analyticsAllowed = localStorage.getItem('analytics') === 'true';

  return consent && analyticsAllowed;
};

export const getConsentTypes = () => {
  if (typeof window === 'undefined')
    return {functional: false, analytics: false};

  const consent = localStorage.getItem('cookieConsent');

  return {
    functional: consent === 'necessary' || consent === 'all', // Functioneel is altijd aan als er consent is
    analytics: localStorage.getItem('analytics') === 'true', // Analytics alleen als specifiek toegestaan
  };
};
