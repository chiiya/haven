import { Purpose } from '../types';
import Cookies from './cookies';

export default class CookieManager {
  /**
   * Enable cookies for a given purpose (e.g. analytics).
   * @param purpose
   * @param prefix
   */
  public static enableCookies(purpose: Purpose, prefix = 'cookies'): void {
    Cookies.set(`${prefix}-${purpose}`, 'true', { expires: 395 });
  }

  /**
   * Disable cookies for a given purpose (e.g. analytics).
   * @param purpose
   * @param prefix
   */
  public static disableCookies(purpose: Purpose, prefix = 'cookies'): void {
    Cookies.set(`${prefix}-${purpose}`, 'false', { expires: 395 });
  }
}
