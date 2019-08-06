import Cookies, { CookieAttributes } from 'js-cookie';

export default class CookieManager {
  /**
   * Cookie Prefix
   */
  protected prefix = 'ap';

  /**
   * Set the cookie prefix.
   * @param prefix
   */
  public setPrefix(prefix: string): this {
    this.prefix = prefix;
    return this;
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
  public static setCookie(name: string, value: string, options: CookieAttributes): void {
    Cookies.set(name, value, options);
  }

  /**
   * Check whether cookie exists.
   * @param name
   */
  public static cookieExists(name: string): boolean {
    return Cookies.get(name) !== undefined && Cookies.get(name) !== '';
  }

  /**
   * Set the functional cookie.
   * @param enabled
   */
  public setFunctionalCookie(enabled: boolean): void {
    Cookies.set(`${this.prefix}-functional`, enabled.toString(), { expires: 365 });
  }

  /**
   * Check whether the functional cookie has been set.
   */
  public hasFunctionalCookie(): boolean {
    return CookieManager.cookieExists(`${this.prefix}-functional`);
  }

  /**
   * Set the analytics cookie.
   * @param enabled
   */
  public setAnalyticsCookie(enabled: boolean): void {
    Cookies.set(`${this.prefix}-analytics`, enabled.toString(), { expires: 365 });
  }

  /**
   * Check whether the analytics cookie has been set.
   */
  public hasAnalyticsCookie(): boolean {
    return CookieManager.cookieExists(`${this.prefix}-analytics`);
  }

  /**
   * Set the marketing cookie.
   * @param enabled
   */
  public setMarketingCookie(enabled: boolean): void {
    Cookies.set(`${this.prefix}-marketing`, enabled.toString(), { expires: 365 });
  }

  /**
   * Check whether the marketing cookie has been set.
   */
  public hasMarketingCookie(): boolean {
    return CookieManager.cookieExists(`${this.prefix}-marketing`);
  }

  /**
   * Accept all cookies.
   */
  public acceptAll(): void {
    this.setFunctionalCookie(true);
    this.setAnalyticsCookie(true);
    this.setMarketingCookie(true);
  }
}
