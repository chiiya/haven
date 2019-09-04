import { Configuration, CookieConsentOptions } from '../types';

export default class ConfigurationResolver {
  /**
   * Resolve configuration using some default options.
   * @param options
   */
  public static resolve(options: CookieConsentOptions): Configuration {
    return Object.assign({
      type: 'opt-in',
      injectServices: true,
    }, options)
  }
}
