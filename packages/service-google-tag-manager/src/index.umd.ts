import { GoogleTagManager } from './index';

if (typeof window !== 'undefined') {
  (window as any).GoogleTagManagerService = GoogleTagManager;
}

export { GoogleTagManager };
