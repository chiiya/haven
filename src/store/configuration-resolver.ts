import { HavenOptions } from '../../types';
import store from './index';
import { mergeDeep } from '../utils';

export default class ConfigurationResolver {
  /**
   * Resolve configuration using some default options.
   * @param options
   */
  public static resolve(options: Partial<HavenOptions>) {
    if (options.domains && Array.isArray(options.domains)) {
      options.domains = options.domains.map(domain => domain.startsWith('.') ? domain : `.${domain}`);
    }

    this.resolveBaseConfiguration(options);
    store.notification = mergeDeep(store.notification, options.notification);
    store.translations = mergeDeep(store.translations, options.translations);
  }

  /**
   * Resolve the base configuration values.
   * @param options
   */
  public static resolveBaseConfiguration(options: Partial<HavenOptions>) {
    for (const item of ['prefix', 'cookies', 'lang', 'type', 'services'])  {
      if (options[item] !== undefined) {
        store[item] = options[item];
      }
    }
    const domains = options.domains || [];
    store.domains = domains.length > 0 ? domains : this.getDomains();
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
