import { useCallback } from 'react';

export default function useAnalytics() {
  const trackEvent = useCallback((eventName, eventProps = {}) => {
    // 1. Google Analytics 4
    if (window.gtag) {
      window.gtag('event', eventName, eventProps);
    } else if (import.meta.env.DEV) {
      console.log(`[GA4 Track Event]: ${eventName}`, eventProps);
    }

    // 2. Plausible Analytics
    if (window.plausible) {
      window.plausible(eventName, { props: eventProps });
    } else if (import.meta.env.DEV) {
      console.log(`[Plausible Track Event]: ${eventName}`, eventProps);
    }
  }, []);

  const trackPageView = useCallback((path) => {
    // 1. Google Analytics 4
    if (window.gtag) {
      const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-K4G925S993';
      window.gtag('config', measurementId, {
        page_path: path,
      });
    } else if (import.meta.env.DEV) {
      console.log(`[GA4 PageView]: ${path}`);
    }

    // 2. Plausible Analytics (usually auto-tracks, but handle manual tracking in single page routing)
    if (window.plausible) {
      window.plausible('pageview', { u: window.location.origin + path });
    } else if (import.meta.env.DEV) {
      console.log(`[Plausible PageView]: ${path}`);
    }
  }, []);

  return { trackEvent, trackPageView };
}
