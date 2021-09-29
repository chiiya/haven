import { AlpineBridge } from './index';

if (typeof window !== 'undefined') {
  (window as any).AlpineBridge = AlpineBridge;
}

export { AlpineBridge };
