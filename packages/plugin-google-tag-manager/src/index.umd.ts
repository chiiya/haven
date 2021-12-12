import { GoogleTagManager } from './index';

if (typeof window !== 'undefined') {
  (window as any).GoogleTagManager = GoogleTagManager;
}

export { GoogleTagManager };
