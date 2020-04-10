import { mergeDeep } from '../helpers/merge';
import { HavenOptions } from '../types';

export default class ConfigurationResolver {
  /**
   * Resolve configuration using some default options.
   * @param options
   * @param config
   */
  public static resolve(
    options: Partial<HavenOptions>,
    config: HavenOptions
  ): HavenOptions {
    if (options.domains && Array.isArray(options.domains)) {
      options.domains = this.normalizeDomains(options.domains);
    }

    this.resolveBaseConfiguration(config, options);
    config.notification = mergeDeep(config.notification, options.notification);
    config.translations = mergeDeep(config.translations, options.translations);

    return config;
  }

  /**
   * Resolve the base configuration values.
   * @param config
   * @param options
   */
  public static resolveBaseConfiguration(
    config: HavenOptions,
    options: Partial<HavenOptions>
  ) {
    const keys = ['prefix', 'cookies', 'type', 'services', 'purposes'];
    for (const item of keys) {
      const value = options[item];
      if (value !== undefined) {
        config[item] = value;
      }
    }
    const domains = options.domains || [];
    config.domains = domains.length > 0 ? domains : this.getDomains();
    config.lang = this.detectLanguage(options);
  }

  /**
   * Detect the language, from:
   * - Configuration option
   * - HTML lang attribute
   * - Default value
   * @param options
   */
  protected static detectLanguage(options: Partial<HavenOptions>): string {
    const lang = (
      options.lang ||
      document.documentElement.lang ||
      'en'
    ).toLowerCase();
    const result = /^(\w{2})-(\w{2})$/.exec(lang);
    return result === null ? lang : result[1];
  }

  /**
   * Resolve the base domain (without subdomains). This solution will only work for ~80-90% of use cases,
   * in other cases the users will have to manually specify the domain.
   */
  protected static getDomains(): string[] {
    const domains = [];
    const host = window.location.hostname;
    const simple = host.match(
      /(?:[A-Za-z0-9-]+\.)*([A-Za-z0-9-]+\.co.uk|\.com.br|\.co.jp|\.com.au)\b/
    );
    if (simple !== null) {
      domains.push(simple[1]);
    }
    const matches = host.match(
      /(?:[A-Za-z0-9-]+\.)*([A-Za-z0-9-]+\.(?:[A-za-z]{2}|[A-Za-z]{3,}))\b/
    );
    if (matches !== null) {
      domains.push(matches[1]);
    }
    domains.push(host);
    return this.normalizeDomains(domains);
  }

  /**
   * Normalize domains: they should start with a `.` symbol.
   * @param domains
   */
  protected static normalizeDomains(domains: string[]): string[] {
    return domains.map(domain =>
      domain.startsWith('.') ? domain : `.${domain}`
    );
  }
}
