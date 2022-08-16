import { CookieAttributes, CookieJar } from '@anshin/types';

/**
 * Cookies helper class,
 */
export default class Cookies {
  /**
   * Create a new cookie or replace an existing one.
   */
  public static set(key: string, value: string|number|boolean, options?: CookieAttributes): void {
    const attributes = this.resolveOptions(options);
    const cookieAttributes = this.encodeAttributes(attributes);
    document.cookie = `${key}=${value}${cookieAttributes}`;
  }

  /**
   * Retrieve a cookie by name.
   */
  public static get(key: string): string | undefined {
    const cookies = document.cookie ? document.cookie.split('; ') : [];
    for (const cookie of cookies) {
      const parts = cookie.split('=');
      const name = parts[0];

      if (key === name) {
        return this.getValue(parts);
      }
    }
  }

  /**
   * Check whether cookie exists.
   */
  public static exists(key: string): boolean {
    return Cookies.get(key) !== undefined && Cookies.get(key) !== '';
  }

  /**
   * Get all cookies.
   */
  public static getAll(): CookieJar {
    const cookies = document.cookie ? document.cookie.split('; ') : [];
    const jar: CookieJar = {};
    for (const cookie of cookies) {
      const parts = cookie.split('=');
      const name = parts[0];
      jar[name] = this.getValue(parts);
    }

    return jar;
  }

  /**
   * Remove an existing cookie.
   */
  public static remove(key: string | RegExp, options: CookieAttributes = {}): void {
    const attributes = this.resolveOptions({ ...options, expires: -1 });
    if (key instanceof RegExp) {
      return this.removeByRegex(key, attributes);
    }

    this.set(key, '', attributes);
  }

  /**
   * Get the value for a cookie.
   */
  protected static getValue(parts: string[]): string {
    let value = parts.slice(1).join('=');

    if (value.charAt(0) === '"') {
      value = value.slice(1, -1);
    }

    return value;
  }

  /**
   * Remove a cookie by regular expression.
   */
  protected static removeByRegex(key: RegExp, attributes: CookieAttributes): void {
    Object.keys(this.getAll()).map((name) => {
      if (key.test(name)) {
        this.set(name, '', attributes);
      }
    });
  }

  /**
   * Encode the cookie attributes.
   */
  protected static encodeAttributes(attributes: CookieAttributes): string {
    let cookieAttributes = '';
    for (const name of Object.keys(attributes)) {
      const attribute = attributes[name as keyof CookieAttributes];
      if (!attribute) {
        continue;
      }
      cookieAttributes += `; ${name}=${attribute}`;
    }

    return cookieAttributes;
  }

  /**
   * Resolve cookie attributes using some default options.
   */
  protected static resolveOptions(options?: CookieAttributes): CookieAttributes {
    if (options && typeof options.expires === 'number') {
      options.expires = new Date(Date.now() + options.expires * 864e5);
    }
    if (options && options.expires instanceof Date) {
      options.expires = options.expires.toUTCString();
    }

    return {
      path: '/',
      ...options,
    };
  }
}
