import { CookieAttributes } from '../types';
import Cookies from './cookies';
import store from './store';
import EventBus from './event-bus';
import { getAllPurposes } from './utils';

export default class CookieManager {
  /**
   * Get cookie by name.
   * @param name
   */
  public static getCookie(name: string): string | undefined {
    return Cookies.get(name);
  }

  /**
   * Set cookie by name.
   * @param name
   * @param value
   * @param options
   */
  public static setCookie(name: string, value: string, options?: CookieAttributes): void {
    Cookies.set(name, value, options);
  }

  /**
   * Remove cookie by name.
   * @param name
   * @param options
   */
  public static removeCookie(name: string, options?: CookieAttributes): void {
    Cookies.remove(name, options);
  }

  /**
   * Check whether cookie exists.
   * @param name
   */
  public static cookieExists(name: string): boolean {
    return Cookies.get(name) !== undefined && Cookies.get(name) !== '';
  }

  /**
   * Enable the functional cookie.
   */
  public static enableFunctionalCookie(): void {
    this.setCookie(`${store.prefix}-functional`, 'true', { expires: 365 });
    EventBus.emit('functional-enabled');
  }

  /**
   * Check whether the functional cookie has been set.
   */
  public static hasFunctionalCookie(): boolean {
    return this.cookieExists(`${store.prefix}-functional`);
  }

  /**
   * Enable cookies for a given purpose (e.g. analytics).
   * @param purpose
   */
  public static enableCookies(purpose: string): void {
    this.setCookie(`${store.prefix}-${purpose}`, 'true', { expires: 365 });
    EventBus.emit(`${purpose}-enabled`);
  }

  /**
   * Disable cookies for a given purpose (e.g. analytics).
   * @param purpose
   */
  public static disableCookies(purpose: string): void {
    this.setCookie(`${store.prefix}-${purpose}`, 'false', { expires: 365 });
    EventBus.emit(`${purpose}-disabled`);
  }

  /**
   * Check whether cookies for a given purpose are enabled (e.g. analytics).
   * @param purpose
   */
  public static hasCookiesEnabled(purpose: string): boolean {
    const cookie = this.getCookie(`${store.prefix}-${purpose}`);

    if (store.type === 'opt-in') {
      return cookie === 'true';
    }

    return cookie === undefined || cookie === 'true';
  }

  /**
   * Accept all cookies.
   */
  public static enableAllCookies(): void {
    getAllPurposes().map(purpose => this.enableCookies(purpose));
  }

  /**
   * Decline all cookies.
   */
  public static disableAllCookies(): void {
    getAllPurposes().map(purpose => this.disableCookies(purpose));
  }
}
