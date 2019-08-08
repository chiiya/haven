import Cookies, { CookieAttributes } from 'js-cookie';
import { ConsentType, CookieConsentOptions } from '../types';

export default class CookieManager {
  /**
   * Consent-Type: Opt-In / Opt-Out.
   */
  protected type: ConsentType;

  /**
   * Cookie Prefix
   */
  protected prefix = 'ap';

  /**
   * Google Analytics ID.
   */
  protected gaId: string | undefined;

  /**
   * Create CookieManager instance.
   * @param prefix
   * @param gaId
   * @param type
   */
  constructor({ prefix, gaId, type }: CookieConsentOptions = {}) {
    this.type = type || 'opt-in';
    this.prefix = prefix || 'ap';
    this.gaId = gaId;
  }

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
    Cookies.set(name, value, options || {});
  }

  /**
   * Remove cookie by name.
   * @param name
   */
  public static removeCookie(name: string): void {
    Cookies.remove(name);
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
  public enableFunctionalCookie(): void {
    CookieManager.setCookie(`${this.prefix}-functional`, 'true', { expires: 365 });
  }

  /**
   * Disable (remove) functional cookie, resulting in new cookie consent request.
   */
  public disableFunctionalCookie(): void {
    CookieManager.removeCookie(`${this.prefix}-functional`);
  }

  /**
   * Check whether the functional cookie has been set.
   */
  public hasFunctionalCookie(): boolean {
    return CookieManager.cookieExists(`${this.prefix}-functional`);
  }

  /**
   * Enable analytics cookie.
   */
  public enableAnalyticsCookie(): void {
    CookieManager.setCookie(`${this.prefix}-analytics`, 'true', { expires: 365 });
    if (this.gaId !== undefined) {
      CookieManager.removeCookie(`ga-disable-${this.gaId}`);
    }
  }

  /**
   * Disable analytics cookie.
   */
  public disableAnalyticsCookie(): void {
    CookieManager.setCookie(`${this.prefix}-analytics`, 'false', { expires: 365 });
    if (this.gaId !== undefined) {
      CookieManager.setCookie(`ga-disable-${this.gaId}`, 'true', { expires: 365 });
    }
  }

  /**
   * Check whether analytics cookies should be enabled.
   */
  public hasAnalyticsEnabled(): boolean {
    const cookie = CookieManager.getCookie(`${this.prefix}-analytics`);

    if (this.type === 'opt-in') {
      return cookie === 'true';
    }

    return cookie === undefined || cookie === 'true';
  }

  /**
   * Enable the marketing cookie.
   */
  public enableMarketingCookie(): void {
    CookieManager.setCookie(`${this.prefix}-marketing`, 'true', { expires: 365 });
  }

  /**
   * Disable the marketing cookie.
   */
  public disableMarketingCookie(): void {
    CookieManager.setCookie(`${this.prefix}-marketing`, 'false', { expires: 365 });
  }

  /**
   * Check whether marketing cookies should be enabled.
   */
  public hasMarketingEnabled(): boolean {
    const cookie = CookieManager.getCookie(`${this.prefix}-marketing`);

    if (this.type === 'opt-in') {
      return cookie === 'true';
    }

    return cookie === undefined || cookie === 'true';
  }

  /**
   * Accept all cookies.
   */
  public acceptAll(): void {
    this.enableFunctionalCookie();
    this.enableAnalyticsCookie();
    this.enableMarketingCookie();
  }
}
