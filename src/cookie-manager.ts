import { ConsentType, CookieManagerOptions, CookieAttributes } from '../types';
import Cookies from './cookies';
import EventBus from './event-bus';

export default class CookieManager {
  /** Consent type: opt-in / opt-out */
  protected type: ConsentType;
  /** Consent cookie name prefix */
  protected prefix: string | undefined;

  constructor({ prefix, type }: CookieManagerOptions = {}) {
    this.type = type || 'opt-in';
    this.prefix = prefix;
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
  public enableFunctionalCookie(): void {
    CookieManager.setCookie(this.getPrefixedCookieName('functional'), 'true', { expires: 365 });
    EventBus.emit('functional-enabled');
  }

  /**
   * Disable (remove) functional cookie, resulting in new cookie consent request.
   */
  public disableFunctionalCookie(): void {
    CookieManager.removeCookie(this.getPrefixedCookieName('functional'));
  }

  /**
   * Check whether the functional cookie has been set.
   */
  public hasFunctionalCookie(): boolean {
    return CookieManager.cookieExists(this.getPrefixedCookieName('functional'));
  }

  /**
   * Enable analytics cookie.
   */
  public enableAnalyticsCookie(): void {
    CookieManager.setCookie(this.getPrefixedCookieName('analytics'), 'true', { expires: 365 });
    EventBus.emit('analytics-enabled');
  }

  /**
   * Disable analytics cookie.
   */
  public disableAnalyticsCookie(): void {
    CookieManager.setCookie(this.getPrefixedCookieName('analytics'), 'false', { expires: 365 });
    EventBus.emit('analytics-disabled');
  }

  /**
   * Check whether analytics cookies should be enabled.
   */
  public hasAnalyticsEnabled(): boolean {
    const cookie = CookieManager.getCookie(this.getPrefixedCookieName('analytics'));

    if (this.type === 'opt-in') {
      return cookie === 'true';
    }

    return cookie === undefined || cookie === 'true';
  }

  /**
   * Enable the marketing cookie.
   */
  public enableMarketingCookie(): void {
    CookieManager.setCookie(this.getPrefixedCookieName('marketing'), 'true', { expires: 365 });
    EventBus.emit('marketing-enabled');
  }

  /**
   * Disable the marketing cookie.
   */
  public disableMarketingCookie(): void {
    CookieManager.setCookie(this.getPrefixedCookieName('marketing'), 'false', { expires: 365 });
    EventBus.emit('marketing-disabled');
  }

  /**
   * Check whether marketing cookies should be enabled.
   */
  public hasMarketingEnabled(): boolean {
    const cookie = CookieManager.getCookie(this.getPrefixedCookieName('marketing'));

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

  /**
   * Get prefixed cookie name, if a prefix has been set by the user.
   * @param name
   */
  protected getPrefixedCookieName(name: string): string {
    if (this.prefix !== undefined) {
      return `${this.prefix}-${name}`;
    }

    return name;
  }
}
