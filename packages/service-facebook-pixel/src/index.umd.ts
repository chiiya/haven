import { FacebookPixel } from './index';

if (typeof window !== 'undefined') {
  (window as any).FacebookPixel = FacebookPixel;
}

export { FacebookPixel };
