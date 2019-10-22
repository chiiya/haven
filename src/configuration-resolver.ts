import { Configuration, CookieConsentOptions } from '../types';

export default class ConfigurationResolver {
  /**
   * Resolve configuration using some default options.
   * @param options
   */
  public static resolve(options: CookieConsentOptions): Configuration {
    if (options.domains && Array.isArray(options.domains) === false) {
      options.domains = <string[]>[options.domains];
    }
    if (options.domains && Array.isArray(options.domains)) {
      options.domains = options.domains.map(domain => domain.startsWith('.') ? domain : `.${domain}`);
    }

    return Object.assign({
      domains: this.getDomains(),
      type: 'opt-in',
      inject: [],
    }, options)
  }

  /**
   * Resolve the base domain (without subdomains). This solution will only work for ~80-90% of use cases,
   * in other cases the users will have to manually specify the domain.
   */
  protected static getDomains(): string[] {
    const domains = [];
    const host = window.location.hostname;
    const simple = host.match(/(?:[A-Za-z0-9-]+\.)*([A-Za-z0-9-]+\.co.uk|\.com.br|\.co.jp|\.com.au)\b/);
    if (simple !== null) {
      domains.push(simple[1]);
    }
    const matches = host.match(/(?:[A-Za-z0-9-]+\.)*([A-Za-z0-9-]+\.(?:[A-za-z]{2}|[A-Za-z]{3,}))\b/);
    if (matches !== null) {
      domains.push(matches[1]);
    }
    domains.push(host);
    return domains;
  }
}
