import CookieManager from './cookies/cookie-manager';
import Haven from './haven';

if (typeof window !== 'undefined') {
  window.Haven = Haven;
}

export { CookieManager, Haven };
