import { Configuration, CookieConsentOptions } from '../types';

export default class ConfigurationResolver {
  /**
   * Resolve configuration using some default options.
   * @param options
   */
  public static resolve(options: CookieConsentOptions): Configuration {
    if (options.domain === undefined) {
      options.domain = this.getDomain();
    }
    if (options.domain && !options.domain.startsWith('.')) {
      options.domain = `.${options.domain}`;
    }
    return Object.assign({
      type: 'opt-in',
      injectServices: true,
    }, options)
  }

  /**
   * Resolve the base domain (without subdomains). This solution will only work for ~80-90% of use cases,
   * in other cases the users will have to manually specify the domain.
   */
  protected static getDomain(): string | undefined {
    const host = window.location.hostname;
    const simple = host.match(/(?:[A-Za-z0-9-]+\.)*([A-Za-z0-9-]+\.co.uk|\.com.br|\.co.jp|\.com.au)\b/);
    if (simple !== null) {
      return simple[1];
    }
    const matches = host.match(/(?:[A-Za-z0-9-]+\.)*([A-Za-z0-9-]+\.(?:[A-za-z]{2}|[A-Za-z]{3,}))\b/);
    if (matches !== null) {
      return matches[1];
    }
  }
}
