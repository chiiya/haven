import { CookieAttributes } from '../types';

export interface CookieJar {
  [name: string]: string;
}

function decode(value: string) {
  return value.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent);
}

/**
 * Cookies helper class,
 * based on https://github.com/js-cookie/js-cookie
 */
export default class Cookies {
  /**
   * Create a new cookie or replace an existing one.
   * @param key
   * @param value
   * @param options
   */
  public static set(key: string, value: any, options?: CookieAttributes) {
    const attributes = this.resolveOptions(options);
    const cookieValue = encodeURIComponent(String(value)).replace(
      /%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g,
      decodeURIComponent,
    );
    const cookieName = encodeURIComponent(String(key))
      .replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent)
      .replace(/[()]/g, escape);
    const cookieAttributes = this.encodeAttributes(attributes);
    document.cookie = `${cookieName}=${cookieValue}${cookieAttributes}`;
  }

  /**
   * Retrieve a cookie by name.
   * @param key
   */
  public static get(key: string): string | undefined {
    const cookies = document.cookie ? document.cookie.split('; ') : [];
    for (const cookie of cookies) {
      const parts = cookie.split('=');
      const name = decode(parts[0]);

      if (key === name) {
        let value = parts.slice(1).join('=');

        if (value.charAt(0) === '"') {
          value = value.slice(1, -1);
        }
        value = decode(value);

        return value;
      }
    }
  }

  /**
   * Get all cookies.
   */
  public static getAll(): CookieJar {
    const cookies = document.cookie ? document.cookie.split('; ') : [];
    const jar: CookieJar = {};
    for (const cookie of cookies) {
      const parts = cookie.split('=');
      const name = decode(parts[0]);
      let value = parts.slice(1).join('=');

      if (value.charAt(0) === '"') {
        value = value.slice(1, -1);
      }
      value = decode(value);

      jar[name] = value;
    }

    return jar;
  }

  /**
   * Remove an existing cookie.
   * @param key
   * @param options
   */
  public static remove(key: string | RegExp, options: CookieAttributes = {}) {
    const attributes = this.resolveOptions(Object.assign(options, { expires: -1 }));
    if (key instanceof RegExp) {
      return this.removeByRegex(key, attributes);
    }

    // Try deleting both unencoded and encoded cookie name
    const cookieAttributes = this.encodeAttributes(attributes);
    document.cookie = `${key}=''${cookieAttributes}`;
    this.set(key, '', attributes);
  }

  /**
   * Remove a cookie by regular expression.
   * @param key
   * @param attributes
   */
  protected static removeByRegex(key: RegExp, attributes: CookieAttributes) {
    Object.keys(this.getAll()).map((name) => {
      if (key.test(name)) {
        // Try deleting both unencoded and encoded cookie name
        const cookieAttributes = this.encodeAttributes(attributes);
        document.cookie = `${name}=''${cookieAttributes}`;
        this.set(name, '', attributes);
      }
    });
  }

  /**
   * Encode the cookie attributes.
   * @param attributes
   */
  protected static encodeAttributes(attributes: CookieAttributes): string {
    let cookieAttributes = '';
    for (const name of Object.keys(attributes)) {
      const attribute = attributes[name];
      if (!attribute) {
        continue;
      }
      cookieAttributes += `; ${name}`;
      if (attribute !== true) {
        cookieAttributes += `=${attribute.split(';')[0]}`;
      }
    }

    return cookieAttributes;
  }

  /**
   * Resolve cookie attributes using some default options.
   * @param options
   */
  protected static resolveOptions(options?: CookieAttributes): CookieAttributes {
    if (options && typeof options.expires === 'number') {
      options.expires = new Date(Date.now() + options.expires * 864e5);
    }
    if (options && options.expires instanceof Date) {
      options.expires = options.expires.toUTCString();
    }

    return Object.assign({
      path: '/',
    }, options);
  }
}
