import { Configuration, CookieConsentOptions } from '../types';

export default class ConfigurationResolver {
  /**
   * Resolve configuration using some default options.
   * @param options
   */
  public static resolve(options: CookieConsentOptions): Configuration {
    if (!options.domain.startsWith('.')) {
      options.domain = `.${options.domain}`;
    }
    return Object.assign({
      type: 'opt-in',
      injectServices: true,
    }, options)
  }
}
