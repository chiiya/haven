import { GoogleAnalytics } from './index';

if (typeof window !== 'undefined') {
  (window as any).GoogleAnalytics = GoogleAnalytics;
}

export { GoogleAnalytics };
