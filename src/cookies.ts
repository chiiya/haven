import { CookieAttributes } from '../types';

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
    document.cookie = `${cookieName}=${cookieValue}${cookieAttributes}`;
  }

  /**
   * Retrieve a cookie by name.
   * @param key
   */
  public static get(key: string): string | undefined {
    const cookies = document.cookie ? document.cookie.split('; ') : [];
    for (const cookie in cookies) {
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
   * Remove an existing cookie.
   * @param key
   * @param options
   */
  public static remove(key: string, options?: CookieAttributes) {
    const attributes = Object.assign(options, { expires: -1 });
    this.set(key, '', attributes);
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
